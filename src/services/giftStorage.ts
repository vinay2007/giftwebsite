/**
 * IndexedDB storage service for gifts and binary media assets.
 * 
 * Avoids storing large media as base64 in localStorage.
 * Stores binary Blobs directly in IndexedDB with zero-copy object URLs.
 */

import { GiftData, initialGiftConfig } from '../config/giftConfig';

const DB_NAME = 'SomewhereBetweenUs_DB';
const DB_VERSION = 1;
const DRAFTS_STORE = 'drafts';
const MEDIA_STORE = 'media_blobs';

let activeObjectUrls: string[] = [];

export function revokeActiveObjectUrls() {
  activeObjectUrls.forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  });
  activeObjectUrls = [];
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        db.createObjectStore(DRAFTS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDraft(gift: GiftData): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([DRAFTS_STORE], 'readwrite');
    const store = tx.objectStore(DRAFTS_STORE);
    // Strip ephemeral blob: object URLs from the saved gift record so they aren't stored stale
    const cleanGift: GiftData = {
      ...gift,
      updatedAt: Date.now(),
      photos: gift.photos.map((p) => ({
        ...p,
        src: p.src.startsWith('blob:') ? '' : p.src,
      })),
      audio: {
        ...gift.audio,
        songSrc: gift.audio.songSrc.startsWith('blob:') ? '' : gift.audio.songSrc,
        voiceSrc: gift.audio.voiceSrc.startsWith('blob:') ? '' : gift.audio.voiceSrc,
      },
    };
    const req = store.put(cleanGift);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getDraft(id: string): Promise<GiftData | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([DRAFTS_STORE], 'readonly');
    const store = tx.objectStore(DRAFTS_STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllDrafts(): Promise<GiftData[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([DRAFTS_STORE], 'readonly');
    const store = tx.objectStore(DRAFTS_STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      const list: GiftData[] = req.result || [];
      // Sort by updatedAt descending
      list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      resolve(list);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await openDB();
  const draft = await getDraft(id);
  return new Promise((resolve, reject) => {
    const tx = db.transaction([DRAFTS_STORE, MEDIA_STORE], 'readwrite');
    const draftsStore = tx.objectStore(DRAFTS_STORE);
    const mediaStore = tx.objectStore(MEDIA_STORE);

    draftsStore.delete(id);

    if (draft) {
      draft.photos.forEach((p) => {
        if (p.blobKey) {
          try {
            mediaStore.delete(p.blobKey);
          } catch {
            // ignore
          }
        }
      });
      if (draft.audio.songBlobKey) {
        try {
          mediaStore.delete(draft.audio.songBlobKey);
        } catch {
          // ignore
        }
      }
      if (draft.audio.voiceBlobKey) {
        try {
          mediaStore.delete(draft.audio.voiceBlobKey);
        } catch {
          // ignore
        }
      }
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function duplicateDraft(id: string): Promise<GiftData> {
  const original = await getDraft(id);
  if (!original) {
    throw new Error('Draft not found to duplicate');
  }

  const duplicatedId = 'gift_' + Math.random().toString(36).substring(2, 9);
  const copy: GiftData = JSON.parse(JSON.stringify(original));
  copy.id = duplicatedId;
  copy.title = `${original.title} (Copy)`;
  copy.createdAt = Date.now();
  copy.updatedAt = Date.now();

  // Clone photo media blobs
  for (let i = 0; i < copy.photos.length; i++) {
    const photo = copy.photos[i];
    if (photo.blobKey) {
      try {
        const blob = await getMediaBlob(photo.blobKey);
        if (blob) {
          const newKey = `media_img_${duplicatedId}_${Date.now()}_${i}`;
          await storeMediaBlob(newKey, blob);
          photo.blobKey = newKey;
        }
      } catch (e) {
        console.warn('Could not clone photo blob', e);
      }
    }
  }

  // Clone song media blob
  if (copy.audio.songBlobKey) {
    try {
      const blob = await getMediaBlob(copy.audio.songBlobKey);
      if (blob) {
        const newKey = `media_song_${duplicatedId}_${Date.now()}`;
        await storeMediaBlob(newKey, blob);
        copy.audio.songBlobKey = newKey;
      }
    } catch (e) {
      console.warn('Could not clone song blob', e);
    }
  }

  // Clone voice media blob
  if (copy.audio.voiceBlobKey) {
    try {
      const blob = await getMediaBlob(copy.audio.voiceBlobKey);
      if (blob) {
        const newKey = `media_voice_${duplicatedId}_${Date.now()}`;
        await storeMediaBlob(newKey, blob);
        copy.audio.voiceBlobKey = newKey;
      }
    } catch (e) {
      console.warn('Could not clone voice blob', e);
    }
  }

  await saveDraft(copy);
  return copy;
}

export async function storeMediaBlob(blobKey: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([MEDIA_STORE], 'readwrite');
    const store = tx.objectStore(MEDIA_STORE);
    const req = store.put(blob, blobKey);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getMediaBlob(blobKey: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([MEDIA_STORE], 'readonly');
    const store = tx.objectStore(MEDIA_STORE);
    const req = store.get(blobKey);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Hydrates a GiftData by converting stored IndexedDB blobs to live Object URLs
 */
export async function hydrateGiftMedia(gift: GiftData): Promise<GiftData> {
  const hydrated: GiftData = JSON.parse(JSON.stringify(gift));

  // Hydrate photos
  for (let i = 0; i < hydrated.photos.length; i++) {
    const photo = hydrated.photos[i];
    if (photo.blobKey) {
      try {
        const blob = await getMediaBlob(photo.blobKey);
        if (blob) {
          const url = URL.createObjectURL(blob);
          activeObjectUrls.push(url);
          photo.src = url;
        }
      } catch (e) {
        console.warn('Failed to load blob for photo', photo.id, e);
      }
    }
  }

  // Hydrate audio
  if (hydrated.audio.songBlobKey) {
    try {
      const blob = await getMediaBlob(hydrated.audio.songBlobKey);
      if (blob) {
        const url = URL.createObjectURL(blob);
        activeObjectUrls.push(url);
        hydrated.audio.songSrc = url;
      }
    } catch (e) {
      console.warn('Failed to load blob for song', e);
    }
  }

  if (hydrated.audio.voiceBlobKey) {
    try {
      const blob = await getMediaBlob(hydrated.audio.voiceBlobKey);
      if (blob) {
        const url = URL.createObjectURL(blob);
        activeObjectUrls.push(url);
        hydrated.audio.voiceSrc = url;
      }
    } catch (e) {
      console.warn('Failed to load blob for voice note', e);
    }
  }

  return hydrated;
}

/**
 * Creates an initial blank draft for a new gift
 */
export function createNewGiftDraft(occasion = 'birthday'): GiftData {
  const id = 'gift_' + Math.random().toString(36).substring(2, 9);
  return {
    ...initialGiftConfig,
    id,
    title: 'My Gift For You',
    occasion: occasion as GiftData['occasion'],
    recipientNickname: '',
    senderNickname: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    opening: {
      tagline: 'A quiet world created for one person',
      greeting: 'Happy Birthday, my love.',
      invitationPrompt: 'I made something special for you',
      enterButtonText: 'Enter our world',
      subtext: 'Step in when you are ready.',
    },
    photos: [],
    letter: {
      salutation: 'Dearest,',
      paragraphs: [
        'Write your heartfelt letter here. Share the memories, feelings, and gratitude you hold for them.',
        'Describe what makes your connection meaningful and what you wish for them in this next chapter.',
      ],
      signOff: 'Forever with you,\nYours always',
    },
    audio: {
      songTitle: '',
      songArtist: '',
      songSrc: '',
      voiceTitle: 'A voice message for you',
      voiceSrc: '',
      note: 'Listen whenever you have a quiet moment.',
    },
    finalReveal: {
      title: 'A wish from my heart',
      birthdayWish: 'May you always know how deeply cherished, loved, and valued you are.',
      closingProse: 'Somewhere between us, this world will always remain.',
      editableNotePlaceholder: '',
    },
  };
}
