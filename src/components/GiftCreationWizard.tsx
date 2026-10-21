import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Save,
  Check,
  AlertCircle,
  Upload,
  Trash2,
  MoveUp,
  MoveDown,
  Music,
  Mic,
  Play,
  Pause,
  Image as ImageIcon,
  Sparkles,
  Download,
  Heart,
  Calendar,
  Volume2,
  RotateCcw,
  Globe,
  Copy,
  ExternalLink,
  Key,
  Loader2,
} from 'lucide-react';
import {
  GiftData,
  OccasionType,
  PaletteType,
  AnimationIntensity,
  FontPairing,
  ThemeStyle,
} from '../config/giftConfig';
import { storeMediaBlob } from '../services/giftStorage';
import { VoiceRecorder } from './VoiceRecorder';
import { publishGiftToVercel, updatePublishedGift, checkCloudStatus } from '../services/publishService';

interface GiftCreationWizardProps {
  gift: GiftData;
  onChange: (updated: GiftData) => void;
  onSaveDraft: () => Promise<void>;
  onEnterRecipientPreview: () => void;
  onExitToLanding: () => void;
  lastSavedAt: number | null;
}

const OCCASIONS: { id: OccasionType; label: string }[] = [
  { id: 'birthday', label: 'Birthday' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'valentines', label: "Valentine's Day" },
  { id: 'just_because', label: 'Just Because' },
  { id: 'long_distance', label: 'Long Distance Surprise' },
  { id: 'apology', label: 'Heartfelt Apology' },
  { id: 'custom', label: 'Custom Occasion' },
];

const THEME_STYLES: { id: ThemeStyle; label: string; desc: string; icon: string }[] = [
  { id: 'midnight', label: 'Midnight Romance', desc: 'Cinematic editorial dark experience with large moon & floating frames', icon: '🌙' },
  { id: 'wonderland', label: 'Birthday Wonderland', desc: 'Bright celebratory experience with festive colors & interactive cake', icon: '🎂' },
  { id: 'garden', label: 'Secret Garden', desc: 'Botanical storybook experience with winding path & flowers', icon: '🌿' },
  { id: 'scrapbook', label: 'Our Scrapbook', desc: 'Tactile memory album with layered Polaroids & washi tape', icon: '📖' },
];

const PALETTES: { id: PaletteType; label: string; desc: string; previewClass: string }[] = [
  {
    id: 'obsidian',
    label: 'Obsidian & Gold',
    desc: 'Deep warm charcoal canvas with luminous amber glow',
    previewClass: 'from-[#070709] via-[#14141c] to-[#251e17] border-amber-300/40',
  },
  {
    id: 'indigo',
    label: 'Midnight Indigo',
    desc: 'Deep celestial navy with cool starlight silver',
    previewClass: 'from-[#060813] via-[#0f142b] to-[#1a224a] border-blue-300/40',
  },
  {
    id: 'rosewood',
    label: 'Velvet Rosewood',
    desc: 'Muted wine charcoal with soft champagne rose highlights',
    previewClass: 'from-[#0f080b] via-[#24131b] to-[#3a1d29] border-rose-300/40',
  },
  {
    id: 'starlight',
    label: 'Pure Starlight',
    desc: 'Stark monochrome obsidian with diamond-white highlights',
    previewClass: 'from-[#040405] via-[#111116] to-[#22222a] border-zinc-400/40',
  },
];

const FONT_PAIRINGS: { id: FontPairing; label: string; sample: string }[] = [
  { id: 'cormorant', label: 'Cormorant Garamond', sample: 'Delicate, ethereal romantic poetry' },
  { id: 'playfair', label: 'Playfair Display', sample: 'Classic, balanced and high-fashion luxury' },
  { id: 'editorial', label: 'Fraunces / Literary', sample: 'Warm, humanistic and bookish serif' },
];

export const GiftCreationWizard: React.FC<GiftCreationWizardProps> = ({
  gift,
  onChange,
  onSaveDraft,
  onEnterRecipientPreview,
  onExitToLanding,
  lastSavedAt,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Song playback preview
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [songTime, setSongTime] = useState({ current: '0:00', total: '0:00' });
  const [isSongDragging, setIsSongDragging] = useState(false);

  const songAudioRef = useRef<HTMLAudioElement | null>(null);

  // Cloud Publishing State (Vercel Blob)
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatusText, setPublishStatusText] = useState<string>('');
  const [publishError, setPublishError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const totalSteps = 7;

  const stepTitles = [
    'Who is this gift for?',
    'Write your message',
    'Add your photos',
    'Add music and voice',
    'Make it yours',
    'Preview your gift',
    'Ready to share?',
  ];

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleUpdate = (updater: (prev: GiftData) => GiftData) => {
    const updated = updater(gift);
    onChange(updated);
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await onSaveDraft();
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  // Image file handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, replaceIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please choose an image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('The selected photo exceeds 15MB. Please choose a slightly smaller photo.');
      return;
    }

    setErrorMsg(null);
    const blobKey = `media_img_${gift.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await storeMediaBlob(blobKey, file);

    const objectUrl = URL.createObjectURL(file);

    handleUpdate((prev) => {
      const photos = [...prev.photos];
      if (replaceIndex !== undefined && replaceIndex >= 0 && replaceIndex < photos.length) {
        photos[replaceIndex] = {
          ...photos[replaceIndex],
          src: objectUrl,
          blobKey,
        };
      } else {
        photos.push({
          id: `photo_${Date.now()}`,
          src: objectUrl,
          blobKey,
          alt: file.name,
          caption: 'A precious moment held in light.',
          dateOrLocation: 'A quiet memory',
          rotation: (Math.random() - 0.5) * 5,
        });
      }
      return { ...prev, photos };
    });
  };

  // Song audio processing
  const processSongFile = async (file: File) => {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|webm)$/i)) {
      setErrorMsg('Please select a supported audio format (MP3, WAV, M4A, AAC, or OGG).');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setErrorMsg('The selected audio file exceeds 30MB. Please choose a smaller track.');
      return;
    }

    setErrorMsg(null);
    const songBlobKey = `media_song_${gift.id}_${Date.now()}`;
    await storeMediaBlob(songBlobKey, file);
    const objectUrl = URL.createObjectURL(file);

    const cleanTitle = file.name.replace(/\.[^/.]+$/, '');

    handleUpdate((prev) => ({
      ...prev,
      audio: {
        ...prev.audio,
        songSrc: objectUrl,
        songBlobKey,
        songTitle: prev.audio.songTitle || cleanTitle,
      },
    }));

    setIsPlayingSong(false);
  };

  const handleSongUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processSongFile(file);
    }
  };

  const handleSongDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsSongDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSongFile(file);
    }
  };

  const togglePlaySong = () => {
    if (!songAudioRef.current) return;
    if (isPlayingSong) {
      songAudioRef.current.pause();
      setIsPlayingSong(false);
    } else {
      songAudioRef.current.play().then(() => setIsPlayingSong(true));
    }
  };

  const handleRemoveSong = () => {
    if (songAudioRef.current) {
      songAudioRef.current.pause();
    }
    setIsPlayingSong(false);
    handleUpdate((prev) => ({
      ...prev,
      audio: {
        ...prev.audio,
        songSrc: '',
        songBlobKey: undefined,
        songTitle: '',
      },
    }));
  };

  // Voice recording callbacks
  const handleSaveVoiceRecording = async (blob: Blob, url: string) => {
    const voiceBlobKey = `media_voice_${gift.id}_${Date.now()}`;
    await storeMediaBlob(voiceBlobKey, blob);

    handleUpdate((prev) => ({
      ...prev,
      audio: {
        ...prev.audio,
        voiceSrc: url,
        voiceBlobKey,
      },
    }));
  };

  const handleRemoveVoiceRecording = () => {
    handleUpdate((prev) => ({
      ...prev,
      audio: {
        ...prev.audio,
        voiceSrc: '',
        voiceBlobKey: undefined,
      },
    }));
  };

  // Export clean gift backup file
  const handleExportBackup = () => {
    const cleanConfig = {
      ...gift,
      photos: gift.photos.map((p) => ({
        id: p.id,
        alt: p.alt,
        caption: p.caption,
        dateOrLocation: p.dateOrLocation,
        rotation: p.rotation,
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(cleanConfig, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(gift.title || 'gift').toLowerCase().replace(/\s+/g, '_')}_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Publish to Vercel Blob
  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError(null);
    setPublishStatusText('Connecting to cloud storage...');
    try {
      const result = await publishGiftToVercel(gift, (status) => {
        setPublishStatusText(status);
      });

      handleUpdate((prev) => ({
        ...prev,
        isPublished: true,
        publishedId: result.publicId,
        publicUrl: result.publicUrl,
        recoveryKey: result.recoveryKey,
        publishedAt: result.publishedAt,
      }));

      await onSaveDraft();
    } catch (err: unknown) {
      const e = err as Error;
      setPublishError(e.message || 'Failed to publish gift.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Update existing published gift
  const handleUpdateExisting = async () => {
    if (!gift.publishedId || !gift.recoveryKey) return;
    setIsPublishing(true);
    setPublishError(null);
    setPublishStatusText('Updating published gift...');
    try {
      const updated = await updatePublishedGift(gift.publishedId, gift.recoveryKey, gift);
      handleUpdate((prev) => ({
        ...prev,
        updatedAt: updated.updatedAt,
      }));
      await onSaveDraft();
    } catch (err: unknown) {
      const e = err as Error;
      setPublishError(e.message || 'Failed to update published gift.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Download recovery credentials .txt file
  const handleDownloadRecoveryCredentials = () => {
    if (!gift.publicUrl || !gift.recoveryKey) return;
    const content = `================================================
SOMEWHERE BETWEEN US — GIFT RECOVERY CREDENTIALS
================================================

Public Gift Viewing Link:
${gift.publicUrl}

Secret Management Recovery Key:
${gift.recoveryKey}

Published On:
${new Date(gift.publishedAt || Date.now()).toLocaleString()}

Recipient:
${gift.recipientNickname || 'Unspecified'}

Theme:
${gift.theme?.themeStyle || 'Midnight Romance'}

IMPORTANT:
- Anyone with the Public Link can view your gift on any device without logging in.
- The Secret Recovery Key is required to update or delete this published gift.
- Keep this recovery file safe. Losing this key may mean losing management access to your published gift.
================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `somewhere-between-us-recovery-${gift.publishedId || 'key'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08080c] text-zinc-100 flex flex-col justify-between font-sans selection:bg-amber-300/20">
      {/* Hidden audio element for song preview */}
      {gift.audio.songSrc && (
        <audio
          ref={songAudioRef}
          src={gift.audio.songSrc}
          onTimeUpdate={() => {
            if (!songAudioRef.current) return;
            const current = songAudioRef.current.currentTime;
            const duration = songAudioRef.current.duration || 1;
            setSongProgress((current / duration) * 100);
            setSongTime({
              current: formatSeconds(current),
              total: formatSeconds(duration),
            });
          }}
          onEnded={() => {
            setIsPlayingSong(false);
            setSongProgress(0);
          }}
        />
      )}

      {/* Editor Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitToLanding}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800/60 transition-colors"
            title="Return to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="font-serif italic text-base text-ivory block leading-tight">
              {gift.title || 'Untitled Gift'}
            </span>
            <span className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider">
              {lastSavedAt ? 'Draft saved' : 'Unsaved changes'}
            </span>
          </div>
        </div>

        {/* Step indicator tabs */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs">
          {stepTitles.map((label, idx) => {
            const stepNum = idx + 1;
            const isCurrent = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            return (
              <button
                key={stepNum}
                onClick={() => {
                  if (stepNum === 6) {
                    onEnterRecipientPreview();
                  } else {
                    setCurrentStep(stepNum);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                  isCurrent
                    ? 'bg-amber-200/15 text-amber-200 border border-amber-200/40 font-medium'
                    : isCompleted
                    ? 'text-zinc-300 hover:text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span className="tabular-nums font-mono text-[10px]">
                  0{stepNum}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Top actions: Save & Preview */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
            title="Save draft"
          >
            {isSaving ? <Check className="w-3.5 h-3.5 text-amber-200 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Save Draft</span>
          </button>

          <button
            onClick={onEnterRecipientPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-200 text-zinc-950 text-xs font-medium hover:bg-amber-100 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Gift</span>
          </button>
        </div>
      </header>

      {/* Main Form Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 sm:py-12">
        {/* Step progress bar on small devices */}
        <div className="lg:hidden mb-6 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-serif italic text-amber-200">
            Step 0{currentStep} of 0{totalSteps}
          </span>
          <span className="font-sans font-medium text-zinc-200">
            {stepTitles[currentStep - 1]}
          </span>
        </div>

        {/* User-friendly alert */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-red-300 hover:text-white text-xs underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 1: Who is this gift for? */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
                Step 01
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-ivory">
                Who is this gift for?
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Choose the occasion you are celebrating and the nicknames that belong to the two of you.
              </p>
            </div>

            {/* Occasion Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Select Occasion
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {OCCASIONS.map((occ) => {
                  const isSelected = gift.occasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => handleUpdate((p) => ({ ...p, occasion: occ.id }))}
                      className={`p-3 text-left rounded-xl border text-xs font-sans transition-all ${
                        isSelected
                          ? 'bg-amber-200/15 border-amber-200/60 text-ivory shadow-sm'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <span className="block font-medium">{occ.label}</span>
                    </button>
                  );
                })}
              </div>

              {gift.occasion === 'custom' && (
                <div className="pt-2">
                  <input
                    type="text"
                    value={gift.occasionCustomLabel || ''}
                    onChange={(e) =>
                      handleUpdate((p) => ({ ...p, occasionCustomLabel: e.target.value }))
                    }
                    placeholder="Enter the special occasion..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-ivory focus:outline-none focus:border-amber-200"
                  />
                </div>
              )}
            </div>

            {/* Title & Nicknames */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans text-zinc-400 mb-1">
                  Gift Title:
                </label>
                <input
                  type="text"
                  value={gift.title}
                  onChange={(e) => handleUpdate((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Somewhere Between Us"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs sm:text-sm text-ivory focus:outline-none focus:border-amber-200"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-zinc-400 mb-1">
                  Their Name or Nickname (Recipient):
                </label>
                <input
                  type="text"
                  value={gift.recipientNickname}
                  onChange={(e) => handleUpdate((p) => ({ ...p, recipientNickname: e.target.value }))}
                  placeholder="e.g. gf, my love, angel..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs sm:text-sm text-ivory focus:outline-none focus:border-amber-200"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-zinc-400 mb-1">
                  Your Name or Nickname (Sender):
                </label>
                <input
                  type="text"
                  value={gift.senderNickname}
                  onChange={(e) => handleUpdate((p) => ({ ...p, senderNickname: e.target.value }))}
                  placeholder="e.g. your man, yours forever..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs sm:text-sm text-ivory focus:outline-none focus:border-amber-200"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-zinc-400 mb-1">
                  Opening Greeting:
                </label>
                <input
                  type="text"
                  value={gift.opening.greeting}
                  onChange={(e) =>
                    handleUpdate((p) => ({
                      ...p,
                      opening: { ...p.opening, greeting: e.target.value },
                    }))
                  }
                  placeholder="e.g. Happy Birthday, my love."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs sm:text-sm text-ivory focus:outline-none focus:border-amber-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Write your message */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
                Step 02
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-ivory">
                Write your message
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Share your personal feelings and memories. Separate each paragraph with a blank line.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-zinc-400 mb-1">
                  Greeting / Salutation:
                </label>
                <input
                  type="text"
                  value={gift.letter.salutation}
                  onChange={(e) =>
                    handleUpdate((p) => ({
                      ...p,
                      letter: { ...p.letter, salutation: e.target.value },
                    }))
                  }
                  placeholder="e.g. My dearest,"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-ivory font-serif focus:outline-none focus:border-amber-200"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-zinc-400 mb-1">
                  Your Letter (separate paragraphs with an empty blank line):
                </label>
                <textarea
                  value={gift.letter.paragraphs.join('\n\n')}
                  onChange={(e) => {
                    const paras = e.target.value
                      .split('\n\n')
                      .map((x) => x.trim())
                      .filter(Boolean);
                    handleUpdate((p) => ({
                      ...p,
                      letter: { ...p.letter, paragraphs: paras },
                    }));
                  }}
                  rows={8}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-ivory font-serif leading-relaxed focus:outline-none focus:border-amber-200"
                  placeholder="Write your personal words here..."
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-zinc-400 mb-1">
                  Sign-off / Closing:
                </label>
                <textarea
                  value={gift.letter.signOff}
                  onChange={(e) =>
                    handleUpdate((p) => ({
                      ...p,
                      letter: { ...p.letter, signOff: e.target.value },
                    }))
                  }
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-ivory font-serif focus:outline-none focus:border-amber-200"
                  placeholder="e.g. Forever and always,\nYours"
                />
              </div>
            </div>

            {/* Final Reveal Message Fields */}
            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <h3 className="text-base font-serif text-ivory">
                Final Reveal & Closing Wish
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                These words will be revealed in the final chapter as celestial rings gather around your message.
              </p>

              <div>
                <label className="block text-xs font-sans text-zinc-400 mb-1">
                  Closing Wish:
                </label>
                <textarea
                  value={gift.finalReveal.birthdayWish}
                  onChange={(e) =>
                    handleUpdate((p) => ({
                      ...p,
                      finalReveal: { ...p.finalReveal, birthdayWish: e.target.value },
                    }))
                  }
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-ivory font-serif focus:outline-none focus:border-amber-200"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-zinc-400 mb-1">
                  Closing Whisper Line:
                </label>
                <input
                  type="text"
                  value={gift.finalReveal.closingProse}
                  onChange={(e) =>
                    handleUpdate((p) => ({
                      ...p,
                      finalReveal: { ...p.finalReveal, closingProse: e.target.value },
                    }))
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs sm:text-sm text-ivory font-serif focus:outline-none focus:border-amber-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Add your photos */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
                  Step 03
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-ivory">
                  Add your photos ({gift.photos.length})
                </h2>
                <p className="text-xs text-zinc-400 font-sans mt-1">
                  Upload photos from your device. Each photograph floats organically in Chapter 02 and expands when touched.
                </p>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-sans text-zinc-200 border border-zinc-700 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload photo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handlePhotoUpload(e)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Photos List or Empty State */}
            {gift.photos.length === 0 ? (
              <div className="p-10 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3 bg-zinc-900/30">
                <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto text-amber-200">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-serif text-ivory">No photos added yet</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
                  Click Upload photo above to choose pictures from your device. You can add captions and reorder them anytime.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {gift.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:border-zinc-700"
                  >
                    {/* Photo thumbnail */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-700">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-zinc-200 cursor-pointer transition-opacity">
                        <span>Change</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => handlePhotoUpload(e, index)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Photo details & caption */}
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span className="font-serif italic text-amber-200">
                          Photo {index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          {index > 0 && (
                            <button
                              onClick={() => {
                                handleUpdate((prev) => {
                                  const list = [...prev.photos];
                                  const tmp = list[index - 1];
                                  list[index - 1] = list[index];
                                  list[index] = tmp;
                                  return { ...prev, photos: list };
                                });
                              }}
                              className="p-1 hover:text-white"
                              title="Move photo up"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {index < gift.photos.length - 1 && (
                            <button
                              onClick={() => {
                                handleUpdate((prev) => {
                                  const list = [...prev.photos];
                                  const tmp = list[index + 1];
                                  list[index + 1] = list[index];
                                  list[index] = tmp;
                                  return { ...prev, photos: list };
                                });
                              }}
                              className="p-1 hover:text-white"
                              title="Move photo down"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              handleUpdate((prev) => ({
                                ...prev,
                                photos: prev.photos.filter((_, i) => i !== index),
                              }));
                            }}
                            className="p-1 hover:text-red-400 ml-1"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleUpdate((prev) => {
                              const list = [...prev.photos];
                              list[index] = { ...list[index], caption: val };
                              return { ...prev, photos: list };
                            });
                          }}
                          placeholder="Write a caption for this memory..."
                          className="w-full bg-zinc-950 border border-zinc-700/80 rounded px-2.5 py-1.5 text-xs text-ivory font-serif focus:outline-none focus:border-amber-200"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={photo.dateOrLocation || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleUpdate((prev) => {
                              const list = [...prev.photos];
                              list[index] = { ...list[index], dateOrLocation: val };
                              return { ...prev, photos: list };
                            });
                          }}
                          placeholder="Date or location (optional)"
                          className="w-full bg-zinc-950 border border-zinc-700/80 rounded px-2.5 py-1 text-[11px] text-zinc-400 focus:outline-none focus:border-amber-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Add music and voice */}
        {currentStep === 4 && (
          <div className="space-y-10 animate-fadeIn">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
                Step 04
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-ivory">
                Add music and voice
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Add your special song and record a voice message. Audio does not autoplay; your recipient chooses when to listen.
              </p>
            </div>

            {/* Section 1: Choose your song */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-200" />
                  <h3 className="text-base font-serif text-ivory">Choose your song</h3>
                </div>
                <span className="text-xs text-zinc-400 font-sans">
                  Optional
                </span>
              </div>

              {gift.audio.songSrc ? (
                /* Selected Song Player Card */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlaySong}
                        className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-ivory hover:text-amber-200 flex items-center justify-center shrink-0 border border-zinc-700 transition-colors"
                        title={isPlayingSong ? 'Pause preview' : 'Play preview'}
                      >
                        {isPlayingSong ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current translate-x-0.5" />
                        )}
                      </button>

                      <div className="space-y-0.5">
                        <span className="text-xs font-serif text-ivory block font-medium">
                          {gift.audio.songTitle || 'Selected Song'}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-sans">
                          Ready for playback
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors">
                        <span>Replace track</span>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleSongUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={handleRemoveSong}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Remove song"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scrubber progress */}
                  <div className="space-y-1 px-1">
                    <div
                      className="w-full h-1.5 bg-zinc-800 rounded-full cursor-pointer overflow-hidden"
                      onClick={(e) => {
                        if (!songAudioRef.current) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        songAudioRef.current.currentTime = pos * (songAudioRef.current.duration || 1);
                      }}
                    >
                      <div
                        className="h-full bg-amber-200 rounded-full transition-all"
                        style={{ width: `${songProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] tabular-nums text-zinc-500 font-mono">
                      <span>{songTime.current}</span>
                      <span>{songTime.total}</span>
                    </div>
                  </div>

                  {/* Custom display title input */}
                  <div>
                    <label className="block text-xs font-sans text-zinc-400 mb-1">
                      Display Title (as your recipient sees it):
                    </label>
                    <input
                      type="text"
                      value={gift.audio.songTitle}
                      onChange={(e) =>
                        handleUpdate((p) => ({
                          ...p,
                          audio: { ...p.audio, songTitle: e.target.value },
                        }))
                      }
                      placeholder="e.g. Our Special Song"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-ivory focus:outline-none focus:border-amber-200"
                    />
                  </div>
                </div>
              ) : (
                /* Drag & Drop Upload Zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsSongDragging(true);
                  }}
                  onDragLeave={() => setIsSongDragging(false)}
                  onDrop={handleSongDrop}
                  className={`p-8 rounded-xl border border-dashed text-center transition-colors ${
                    isSongDragging
                      ? 'border-amber-200 bg-amber-200/5'
                      : 'border-zinc-700/80 hover:border-zinc-500 bg-zinc-950/40'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto text-amber-200 mb-3">
                    <Music className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-serif text-ivory">Add an audio track from your device</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans mt-1">
                    Drag and drop your audio file here (MP3, WAV, M4A, AAC) or click below to browse.
                  </p>
                  <div className="pt-4">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-ivory text-xs font-medium border border-zinc-600 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-200" />
                      <span>Choose audio file</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleSongUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Record a message for them */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-amber-200" />
                  <h3 className="text-base font-serif text-ivory">Record a message for them</h3>
                </div>
                <span className="text-xs text-zinc-400 font-sans">
                  Optional
                </span>
              </div>

              <VoiceRecorder
                currentVoiceUrl={gift.audio.voiceSrc || null}
                onSaveRecording={handleSaveVoiceRecording}
                onRemoveRecording={handleRemoveVoiceRecording}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Make it yours */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
                Step 05
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-ivory">
                Make it yours
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Curate the visual atmosphere and movement to match the feeling you want to evoke.
              </p>
            </div>

            {/* Theme Style Experience */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Website Experience Style (4 Distinct Themes)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEME_STYLES.map((t) => {
                  const isSelected = (gift.theme.themeStyle || 'midnight') === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        handleUpdate((p) => ({
                          ...p,
                          theme: { ...p.theme, themeStyle: t.id },
                        }))
                      }
                      className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-200/15 border-amber-200/80 shadow-md text-ivory'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{t.icon}</span>
                      <div>
                        <span className="font-serif italic text-sm text-ivory block">
                          {t.label}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                          {t.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Palettes */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Visual Palette
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PALETTES.map((pal) => {
                  const isSelected = gift.theme.palette === pal.id;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() =>
                        handleUpdate((p) => ({
                          ...p,
                          theme: { ...p.theme, palette: pal.id },
                        }))
                      }
                      className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-zinc-900 border-amber-200/70 shadow-md'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${pal.previewClass} border shrink-0`}
                      />
                      <div>
                        <span className="font-serif italic text-sm text-ivory block">
                          {pal.label}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                          {pal.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animation Intensity */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Animation Intensity
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { id: 'subtle', label: 'Subtle', desc: 'Calm, minimal drift' },
                    { id: 'dreamy', label: 'Dreamy', desc: 'Slow, graceful float' },
                    { id: 'expressive', label: 'Expressive', desc: 'Dynamic starlight' },
                  ] as { id: AnimationIntensity; label: string; desc: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleUpdate((p) => ({
                        ...p,
                        theme: { ...p.theme, animationIntensity: item.id },
                      }))
                    }
                    className={`p-3 text-left rounded-xl border transition-all text-xs ${
                      gift.theme.animationIntensity === item.id
                        ? 'bg-amber-200/15 border-amber-200 text-ivory'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="block font-medium">{item.label}</span>
                    <span className="text-[10px] text-zinc-400">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Pairing */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Serif Typography
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FONT_PAIRINGS.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() =>
                      handleUpdate((p) => ({
                        ...p,
                        theme: { ...p.theme, fontPairing: font.id },
                      }))
                    }
                    className={`p-3 text-left rounded-xl border transition-all ${
                      gift.theme.fontPairing === font.id
                        ? 'bg-amber-200/15 border-amber-200 text-ivory'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="block font-serif text-sm">{font.label}</span>
                    <span className="text-[10px] text-zinc-400 italic block mt-1">
                      {font.sample}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Preview your gift */}
        {currentStep === 6 && (
          <div className="space-y-6 text-center py-8 animate-fadeIn">
            <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
              Step 06
            </span>
            <h2 className="text-3xl font-serif text-ivory">
              Preview your gift
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto font-sans leading-relaxed">
              Step into the full-screen cinematic world. Explore the chapters, open photos, test music and voice playback, and return whenever you wish.
            </p>

            <div className="pt-4 flex justify-center">
              <button
                onClick={onEnterRecipientPreview}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-amber-200 text-zinc-950 font-medium text-xs uppercase tracking-widest hover:bg-amber-100 transition-all shadow-xl"
              >
                <Eye className="w-4 h-4" />
                <span>Launch Full-Screen Preview</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Ready to share? */}
        {currentStep === 7 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
                Step 07
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-ivory">
                Ready to share?
              </h2>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Your gift draft is saved and ready on this device.
              </p>
            </div>

            {/* Gift Summary Box */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 uppercase block text-[10px]">Occasion</span>
                  <span className="text-zinc-200 font-medium capitalize">{gift.occasion}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block text-[10px]">Recipient</span>
                  <span className="text-amber-200 font-serif italic text-sm">{gift.recipientNickname || 'None specified'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block text-[10px]">Photos</span>
                  <span className="text-zinc-200 font-medium">{gift.photos.length} added</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block text-[10px]">Palette</span>
                  <span className="text-zinc-200 font-medium capitalize">{gift.theme.palette}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 text-xs flex flex-wrap gap-4 text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Letter: {gift.letter.paragraphs.length} paragraphs written</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Song: {gift.audio.songTitle || 'None (peaceful quiet)'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Voice Message: {gift.audio.voiceSrc ? 'Recorded & attached' : 'None'}</span>
                </div>
              </div>
            </div>

            {/* Cloud Publishing Section (Vercel Blob) */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-5 h-5 text-amber-200" />
                  <div>
                    <h3 className="font-serif italic text-base text-ivory">
                      {gift.isPublished ? 'Cloud Publication & Share Link' : 'Publish to Cloud (Vercel Blob)'}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      {gift.isPublished
                        ? 'Your gift is live on the web and accessible from any device'
                        : 'Upload media to Vercel Blob and generate an unlisted public link'}
                    </p>
                  </div>
                </div>
                {gift.isPublished && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>

              {/* Already Published State */}
              {gift.isPublished && gift.publicUrl ? (
                <div className="space-y-4">
                  {/* Shareable URL Box */}
                  <div>
                    <label className="block text-xs font-sans text-zinc-400 mb-1.5">
                      Shareable Public Link:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={gift.publicUrl}
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-amber-100 select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(gift.publicUrl || '');
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2500);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-200 text-zinc-950 text-xs font-medium hover:bg-amber-100 transition-colors shrink-0"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                      <a
                        href={gift.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs border border-zinc-700 transition-colors shrink-0"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-sans block mt-1.5">
                      Anyone with this unlisted link can experience this gift on phone, tablet, or desktop without logging in.
                    </span>
                  </div>

                  {/* Secret Management Recovery Key Box */}
                  {gift.recoveryKey && (
                    <div className="p-4 rounded-xl bg-zinc-900/70 border border-amber-200/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-200">
                          <Key className="w-4 h-4 text-amber-200" />
                          <span>Secret Management Recovery Key</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleDownloadRecoveryCredentials}
                          className="inline-flex items-center gap-1 text-[11px] text-amber-200 hover:underline"
                        >
                          <Download className="w-3 h-3" />
                          <span>Save Key File (.txt)</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={gift.recoveryKey}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-300 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(gift.recoveryKey || '');
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors shrink-0"
                        >
                          {copiedKey ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">
                        This key authorizes future updates or deletion of this gift without requiring a user account. Store it safely.
                      </p>
                    </div>
                  )}

                  {/* Update Published Gift Button */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={handleUpdateExisting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-ivory text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{publishStatusText || 'Updating...'}</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 text-amber-200" />
                          <span>Update Published Content</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-zinc-500">
                      Theme is locked to “{gift.theme?.themeStyle || 'Midnight Romance'}” for this public URL.
                    </span>
                  </div>
                </div>
              ) : (
                /* Un-published State: Publish Button */
                <div className="space-y-4">
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    Ready to send your gift? Publishing uploads your photos, song, and voice message to Vercel Blob cloud storage and generates a unique, unlisted URL that your recipient can open on any browser.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={handlePublish}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-300 to-amber-200 hover:from-amber-200 hover:to-amber-100 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all shadow-lg disabled:opacity-60"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{publishStatusText || 'Publishing...'}</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          <span>Publish to Cloud & Get Shareable Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message if publish fails */}
              {publishError && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-2 font-medium text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Publishing Notice</span>
                  </div>
                  <p className="leading-relaxed">{publishError}</p>
                  {publishError.includes('BLOB_READ_WRITE_TOKEN') && (
                    <div className="mt-2 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
                      <span className="font-semibold text-amber-200 block">Vercel Setup Instructions:</span>
                      <ol className="list-decimal list-inside space-y-0.5 text-zinc-400">
                        <li>In your Vercel Project Dashboard, navigate to the <strong>Storage</strong> tab.</li>
                        <li>Click <strong>Create Database</strong> and select <strong>Blob</strong>.</li>
                        <li>Copy the generated <code>BLOB_READ_WRITE_TOKEN</code>.</li>
                        <li>Add it to your Vercel Project <strong>Environment Variables</strong> (or local <code>.env</code> file).</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Local Backup & Offline Presentation */}
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
              <span className="font-serif italic text-sm text-ivory block">
                Local Draft & Device Backup
              </span>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Your draft is saved securely in your browser's local IndexedDB with all attached media. You can download an offline JSON backup or present the gift in full screen directly from this device.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sans border border-zinc-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-200" />
                  <span>Download Offline Backup</span>
                </button>

                <button
                  type="button"
                  onClick={onEnterRecipientPreview}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sans border border-zinc-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-200" />
                  <span>Present on this Screen</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Editor Bottom Pagination Bar */}
      <footer className="sticky bottom-0 z-40 bg-zinc-950/85 backdrop-blur-md border-t border-zinc-800/80 px-6 sm:px-10 py-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
          {currentStep} / {totalSteps}
        </span>

        {currentStep < totalSteps ? (
          <button
            onClick={() => {
              if (currentStep === 5) {
                setCurrentStep(6);
              } else {
                setCurrentStep((p) => Math.min(totalSteps, p + 1));
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-200 text-xs uppercase tracking-widest text-ivory transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onEnterRecipientPreview}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-200 text-zinc-950 text-xs font-medium uppercase tracking-widest hover:bg-amber-100 transition-colors"
          >
            <span>Finish & View</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      </footer>
    </div>
  );
};
