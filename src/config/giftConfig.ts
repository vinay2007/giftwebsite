/**
 * Somewhere Between Us — Gift Data Types and Template Defaults
 * 
 * Central schema supporting multi-draft personalization, custom media,
 * themes, typography, and clean separation between editor and recipient views.
 */

export type OccasionType = 
  | 'birthday'
  | 'anniversary'
  | 'valentines'
  | 'just_because'
  | 'apology'
  | 'long_distance'
  | 'custom';

export type PaletteType = 'obsidian' | 'indigo' | 'rosewood' | 'starlight';
export type AnimationIntensity = 'subtle' | 'dreamy' | 'expressive';
export type FontPairing = 'cormorant' | 'playfair' | 'editorial';

export interface MemoryPhoto {
  id: string;
  src: string;
  blobKey?: string;
  alt: string;
  caption: string;
  dateOrLocation?: string;
  rotation?: number; // subtle tilt in degrees (-4 to 4)
  floatDelay?: number;
}

export interface ChapterMeta {
  id: 'world' | 'memories' | 'letter' | 'reveal' | 'envelope';
  number: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

export type ThemeStyle = 'midnight' | 'wonderland' | 'garden' | 'scrapbook';

export interface GiftTheme {
  palette: PaletteType;
  animationIntensity: AnimationIntensity;
  fontPairing: FontPairing;
  themeStyle?: ThemeStyle;
}

export interface GiftData {
  id: string;
  title: string;
  occasion: OccasionType;
  occasionCustomLabel?: string;
  templateId: 'somewhere-between-us' | string;
  createdAt?: number;
  updatedAt?: number;

  recipientNickname: string;
  senderNickname: string;
  siteTitle: string;

  isPublished?: boolean;
  publishedId?: string;
  publicUrl?: string;
  publishedAt?: number;
  recoveryKey?: string;

  theme: GiftTheme;

  opening: {
    tagline: string;
    greeting: string;
    invitationPrompt: string;
    enterButtonText: string;
    subtext: string;
  };

  chapters: ChapterMeta[];
  photos: MemoryPhoto[];

  letter: {
    salutation: string;
    paragraphs: string[];
    signOff: string;
  };

  audio: {
    songTitle: string;
    songArtist?: string;
    songSrc: string;
    songBlobKey?: string;
    voiceTitle: string;
    voiceSrc: string;
    voiceBlobKey?: string;
    note: string;
  };

  finalReveal: {
    title: string;
    birthdayWish: string;
    closingProse: string;
    editableNotePlaceholder: string;
  };

  settings: {
    enableParallax: boolean;
    particleCount: number;
    enableAmbientToneFallback: boolean;
  };
}

// Alias GiftConfig to GiftData for backwards compatibility across existing components
export type GiftConfig = GiftData;

export const initialGiftConfig: GiftData = {
  id: 'demo-somewhere-between-us',
  title: 'Somewhere Between Us',
  occasion: 'birthday',
  templateId: 'somewhere-between-us',
  createdAt: 1729500000000,
  updatedAt: 1729500000000,

  // Recipient & Sender Nicknames
  recipientNickname: "gf",
  senderNickname: "your man",
  siteTitle: "Somewhere Between Us",

  theme: {
    palette: 'obsidian',
    animationIntensity: 'dreamy',
    fontPairing: 'cormorant',
    themeStyle: 'midnight',
  },

  // Chapter 01 — Opening Scene
  opening: {
    tagline: "A quiet world created for one person",
    greeting: "Happy Birthday, gf.",
    invitationPrompt: "I made something for you",
    enterButtonText: "Enter our world",
    subtext: "Take your time. Step in when you are ready.",
  },

  // Chapters Meta
  chapters: [
    {
      id: "world",
      number: "01",
      title: "A little world for you",
      subtitle: "The horizon where everything slows down",
      enabled: true,
    },
    {
      id: "memories",
      number: "02",
      title: "Little pieces of us",
      subtitle: "Moments suspended in time",
      enabled: true,
    },
    {
      id: "letter",
      number: "03",
      title: "A letter from your man",
      subtitle: "Words written only for your eyes",
      enabled: true,
    },
    {
      id: "reveal",
      number: "04",
      title: "Voices & Melodies",
      subtitle: "Music and voice recorded for you",
      enabled: true,
    },
    {
      id: "envelope",
      number: "05",
      title: "The sealed letter",
      subtitle: "There's one last thing for you",
      enabled: true,
    },
  ],

  // Chapter 02 — Floating suspended photo memories
  photos: [
    {
      id: "memory-1",
      src: "/media/memory-01.jpg",
      alt: "Quiet moments together",
      caption: "The quiet shoreline where hours felt like seconds.",
      dateOrLocation: "The place where time stood still",
      rotation: -2.5,
      floatDelay: 0,
    },
    {
      id: "memory-2",
      src: "/media/memory-02.jpg",
      alt: "Holding onto warmth",
      caption: "Holding onto warmth and gentle calm in a noisy world.",
      dateOrLocation: "A quiet evening just for us",
      rotation: 1.8,
      floatDelay: 1.5,
    },
    {
      id: "memory-3",
      src: "/media/memory-03.jpg",
      alt: "Under the same gentle moon",
      caption: "Under the same quiet starlit sky, always with you.",
      dateOrLocation: "Under the quiet sky",
      rotation: -1.2,
      floatDelay: 3.0,
    },
  ],

  // Chapter 03 — Letter from your man
  letter: {
    salutation: "My dearest gf,",
    paragraphs: [
      "There are places in the world that exist only when we are together. In those quiet spaces between our conversations, laughter, and calm silence, something rare and steady found a home.",
      "Today celebrates everything you bring into the world: your gentle strength, your boundless kindness, and the way you make every ordinary day feel like a sanctuary.",
      "I built this quiet corner of the universe so that whenever you need to remember how deeply loved and treasured you are, you can return here.",
    ],
    signOff: "Forever and always,\nYour man",
  },

  // Chapter 04 — Audio player & Voice note
  audio: {
    songTitle: "Our Special Song",
    songArtist: "Our Song",
    songSrc: "/media/orumanam.mp3",
    voiceTitle: "A voice note for you",
    voiceSrc: "/media/voice-note.mp3",
    note: "Listen with your headphones on whenever you have a quiet moment.",
  },

  // Chapter 04 — Final reveal message
  finalReveal: {
    title: "Happy Birthday, my love",
    birthdayWish: "May this year bring you all the gentle peace, boundless joy, and warmth you give to everyone around you.",
    closingProse: "Wherever life takes us, remember this quiet space will always remain right here — somewhere between us.",
    editableNotePlaceholder: "A little surprise note waiting for you at the end of the evening.",
  },

  settings: {
    enableParallax: true,
    particleCount: 50,
    enableAmbientToneFallback: true,
  },
};
