/**
 * Service for publishing gifts and uploading media to Vercel Blob.
 */

import { upload } from '@vercel/blob/client';
import { GiftData } from '../config/giftConfig';
import { getMediaBlob } from './giftStorage';

export interface PublishResult {
  success: boolean;
  publicId: string;
  publicUrl: string;
  recoveryKey: string;
  publishedAt: number;
}

export interface CloudStatus {
  blobConfigured: boolean;
  message: string;
}

/**
 * Checks whether Vercel Blob token is configured on the backend
 */
export async function checkCloudStatus(): Promise<CloudStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) {
      return {
        blobConfigured: false,
        message: 'Could not contact server API.',
      };
    }
    const data = await res.json();
    return {
      blobConfigured: Boolean(data.blobConfigured),
      message: data.message || '',
    };
  } catch (err) {
    return {
      blobConfigured: false,
      message: 'Server connection error.',
    };
  }
}

/**
 * Uploads a local Blob to Vercel Blob storage via secure client token exchange
 */
async function uploadToVercelBlob(pathname: string, fileBlob: Blob): Promise<string> {
  const result = await upload(pathname, fileBlob, {
    access: 'public',
    handleUploadUrl: '/api/blob/upload',
  });
  return result.url;
}

/**
 * Publishes a complete gift to Vercel Blob:
 * 1. Uploads IndexedDB photo, song, and voice blobs to Vercel Blob.
 * 2. Replaces local blob keys and blob: URLs with permanent public Vercel Blob URLs.
 * 3. Commits the public gift document and private recovery hash on the server.
 */
export async function publishGiftToVercel(
  gift: GiftData,
  onProgress?: (step: string) => void
): Promise<PublishResult> {
  onProgress?.('Verifying cloud storage setup...');
  const status = await checkCloudStatus();
  if (!status.blobConfigured) {
    throw new Error(
      'Vercel Blob storage is not configured yet. Please configure BLOB_READ_WRITE_TOKEN in your environment.'
    );
  }

  // Clone gift to avoid mutating local state until upload succeeds
  const preparedGift: GiftData = JSON.parse(JSON.stringify(gift));

  // 1. Upload photos to Vercel Blob
  if (preparedGift.photos && preparedGift.photos.length > 0) {
    for (let i = 0; i < preparedGift.photos.length; i++) {
      const photo = preparedGift.photos[i];
      if (photo.blobKey) {
        onProgress?.(`Uploading photo ${i + 1} of ${preparedGift.photos.length}...`);
        const blob = await getMediaBlob(photo.blobKey);
        if (blob) {
          const extension = blob.type.split('/')[1] || 'jpg';
          const filename = `gifts/media/photo_${Date.now()}_${i}.${extension}`;
          const cloudUrl = await uploadToVercelBlob(filename, blob);
          photo.src = cloudUrl;
        }
      }
    }
  }

  // 2. Upload song to Vercel Blob
  if (preparedGift.audio.songBlobKey) {
    onProgress?.('Uploading soundtrack audio to cloud...');
    const songBlob = await getMediaBlob(preparedGift.audio.songBlobKey);
    if (songBlob) {
      const ext = songBlob.type.includes('wav') ? 'wav' : 'mp3';
      const filename = `gifts/media/song_${Date.now()}.${ext}`;
      const cloudUrl = await uploadToVercelBlob(filename, songBlob);
      preparedGift.audio.songSrc = cloudUrl;
    }
  }

  // 3. Upload voice note to Vercel Blob
  if (preparedGift.audio.voiceBlobKey) {
    onProgress?.('Uploading voice message to cloud...');
    const voiceBlob = await getMediaBlob(preparedGift.audio.voiceBlobKey);
    if (voiceBlob) {
      const ext = voiceBlob.type.includes('mp4') ? 'm4a' : 'webm';
      const filename = `gifts/media/voice_${Date.now()}.${ext}`;
      const cloudUrl = await uploadToVercelBlob(filename, voiceBlob);
      preparedGift.audio.voiceSrc = cloudUrl;
    }
  }

  // 4. Save published gift record on the server
  onProgress?.('Finalizing public gift publication...');
  const res = await fetch('/api/gifts/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gift: preparedGift }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to publish gift.');
  }

  const result = await res.json();
  return result as PublishResult;
}

/**
 * Loads a published gift from the public server API
 */
export async function fetchPublishedGift(publicId: string): Promise<GiftData> {
  const res = await fetch(`/api/gifts/${encodeURIComponent(publicId)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Published gift not found.');
  }
  const data = await res.json();
  return data.gift as GiftData;
}

/**
 * Updates a published gift using its secret recovery key
 */
export async function updatePublishedGift(
  publicId: string,
  recoveryKey: string,
  gift: GiftData
): Promise<GiftData> {
  const res = await fetch(`/api/gifts/${encodeURIComponent(publicId)}/manage`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-recovery-key': recoveryKey,
    },
    body: JSON.stringify({ gift }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || 'Failed to update published gift.');
  }

  const data = await res.json();
  return data.gift as GiftData;
}

/**
 * Deletes a published gift and all its media using its secret recovery key
 */
export async function deletePublishedGift(
  publicId: string,
  recoveryKey: string
): Promise<void> {
  const res = await fetch(`/api/gifts/${encodeURIComponent(publicId)}/manage`, {
    method: 'DELETE',
    headers: {
      'x-recovery-key': recoveryKey,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || 'Failed to delete published gift.');
  }
}
