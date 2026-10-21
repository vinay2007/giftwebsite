import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Mic, Music, Edit3, Check } from 'lucide-react';
import { GiftConfig } from '../config/giftConfig';
import { ambientSynthesizer } from '../utils/audioSynthesizer';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Chapter04RevealProps {
  config: GiftConfig;
  onUpdateRevealMessage?: (message: string, wish: string) => void;
  onGoToNextChapter?: () => void;
}

type AudioMode = 'idle' | 'song' | 'voice' | 'synth';

export const Chapter04Reveal: React.FC<Chapter04RevealProps> = ({
  config,
  onUpdateRevealMessage,
  onGoToNextChapter,
}) => {
  const [activeMode, setActiveMode] = useState<AudioMode>('idle');
  const [songProgress, setSongProgress] = useState(0);
  const [songTime, setSongTime] = useState({ current: '0:00', total: '0:00' });
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [voiceTime, setVoiceTime] = useState({ current: '0:00', total: '0:00' });
  
  const [songError, setSongError] = useState(false);
  const [voiceError, setVoiceError] = useState(false);

  const [customSongSrc, setCustomSongSrc] = useState<string | null>(null);
  const [customVoiceSrc, setCustomVoiceSrc] = useState<string | null>(null);

  const hasSong = Boolean(customSongSrc || config.audio.songSrc);
  const hasVoice = Boolean(customVoiceSrc || config.audio.voiceSrc);
  const hasAnyAudio = hasSong || hasVoice;

  // Editable message states
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [birthdayWish, setBirthdayWish] = useState(config.finalReveal.birthdayWish);
  const [closingProse, setClosingProse] = useState(config.finalReveal.closingProse);

  const songAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Stop everything when switching modes
  const stopAllAudio = () => {
    if (songAudioRef.current) {
      songAudioRef.current.pause();
    }
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
    }
    ambientSynthesizer.stop();
  };

  const togglePlaySong = () => {
    if (activeMode === 'song') {
      songAudioRef.current?.pause();
      setActiveMode('idle');
    } else {
      stopAllAudio();
      if (songAudioRef.current) {
        songAudioRef.current.play().then(() => {
          setActiveMode('song');
          setSongError(false);
        }).catch(() => {
          setSongError(true);
          // If song audio fails, prompt synth fallback
        });
      }
    }
  };

  const togglePlayVoice = () => {
    if (activeMode === 'voice') {
      voiceAudioRef.current?.pause();
      setActiveMode('idle');
    } else {
      stopAllAudio();
      if (voiceAudioRef.current) {
        voiceAudioRef.current.play().then(() => {
          setActiveMode('voice');
          setVoiceError(false);
        }).catch(() => {
          setVoiceError(true);
        });
      }
    }
  };

  const togglePlaySynth = () => {
    if (activeMode === 'synth') {
      ambientSynthesizer.stop();
      setActiveMode('idle');
    } else {
      stopAllAudio();
      ambientSynthesizer.play();
      setActiveMode('synth');
    }
  };

  // Handle local file uploads for immediate browser testing
  const handleLocalSongUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomSongSrc(url);
      setSongError(false);
      setTimeout(() => {
        stopAllAudio();
        if (songAudioRef.current) {
          songAudioRef.current.load();
          songAudioRef.current.play().then(() => setActiveMode('song'));
        }
      }, 100);
    }
  };

  const handleLocalVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVoiceSrc(url);
      setVoiceError(false);
      setTimeout(() => {
        stopAllAudio();
        if (voiceAudioRef.current) {
          voiceAudioRef.current.load();
          voiceAudioRef.current.play().then(() => setActiveMode('voice'));
        }
      }, 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const handleSaveMessage = () => {
    if (onUpdateRevealMessage) {
      onUpdateRevealMessage(closingProse, birthdayWish);
    }
    setIsEditingMessage(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 sm:px-8 select-none overflow-hidden">
      {/* Hidden audio tags */}
      <audio
        ref={songAudioRef}
        src={customSongSrc || config.audio.songSrc}
        preload="metadata"
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
        onEnded={() => setActiveMode('idle')}
        onError={() => setSongError(true)}
      />

      <audio
        ref={voiceAudioRef}
        src={customVoiceSrc || config.audio.voiceSrc}
        preload="metadata"
        onTimeUpdate={() => {
          if (!voiceAudioRef.current) return;
          const current = voiceAudioRef.current.currentTime;
          const duration = voiceAudioRef.current.duration || 1;
          setVoiceProgress((current / duration) * 100);
          setVoiceTime({
            current: formatSeconds(current),
            total: formatSeconds(duration),
          });
        }}
        onEnded={() => setActiveMode('idle')}
        onError={() => setVoiceError(true)}
      />

      {/* Floating Elements Gathering Animation in background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Converging constellation rings */}
        <motion.div
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 3.5, ease: 'easeOut' }}
          className="w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full border border-amber-300/10 pointer-events-none"
        />
        <motion.div
          initial={{ scale: 1.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 4.2, delay: 0.3, ease: 'easeOut' }}
          className="w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full border border-amber-200/15 pointer-events-none"
        />
        {/* Soft focal warm aura */}
        <div className="w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      </div>

      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 max-w-xl mx-auto text-center pb-6"
      >
        <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
          Chapter 04
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ivory font-normal">
          {config.finalReveal.title}
        </h2>
        <p className="text-xs text-zinc-400 font-sans font-light mt-1">
          A voice, a song, and a promise.
        </p>
      </motion.div>

      {/* Main Content Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8"
      >
        {/* Audio Player Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
            <span className="text-zinc-400 font-sans uppercase tracking-wider text-[11px]">
              Audio & Memories for {config.recipientNickname}
            </span>
            {activeMode !== 'idle' && (
              <span className="text-amber-200/90 font-serif italic text-xs animate-pulse">
                {activeMode === 'song' && `Playing: ${config.audio.songTitle}`}
                {activeMode === 'voice' && `Playing: ${config.audio.voiceTitle}`}
                {activeMode === 'synth' && 'Playing: Ambient Melody (Fallback Mode)'}
              </span>
            )}
          </div>

          {/* Conditional Audio Cards */}
          {hasAnyAudio ? (
            <div className={`grid gap-4 ${hasSong && hasVoice ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
              {/* Song Player Card */}
              {hasSong && (
                <div
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    activeMode === 'song'
                      ? 'bg-zinc-900/90 border-amber-200/50 shadow-[0_0_20px_rgba(240,207,152,0.12)]'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-sans">
                        <Music className="w-3.5 h-3.5 text-amber-200/80" />
                        <span>Song</span>
                      </div>
                      <h3 className="text-base font-serif text-ivory">{config.audio.songTitle || 'Our Song'}</h3>
                      <p className="text-[11px] text-zinc-400 font-sans">
                        {config.audio.songArtist || 'Chosen for you'}
                      </p>
                    </div>

                    <button
                      onClick={togglePlaySong}
                      aria-label={activeMode === 'song' ? 'Pause song' : `Play ${config.audio.songTitle || 'song'}`}
                      className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600/60 flex items-center justify-center text-ivory hover:text-amber-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-200"
                    >
                      {activeMode === 'song' ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Progress Slider */}
                  <div className="mt-3 space-y-1">
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
                        className="h-full bg-amber-200/90 rounded-full transition-all"
                        style={{ width: `${songProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] tabular-nums text-zinc-400">
                      <span>{songTime.current}</span>
                      <span>{songTime.total}</span>
                    </div>
                  </div>

                  {songError && (
                    <div className="mt-2 text-center">
                      <button
                        onClick={togglePlaySynth}
                        className="text-[11px] text-amber-200/80 hover:text-amber-200 underline"
                      >
                        {activeMode === 'synth' ? 'Pause Ambient Melody' : 'Play Ambient Melody'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Voice Note Player Card */}
              {hasVoice && (
                <div
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    activeMode === 'voice'
                      ? 'bg-zinc-900/90 border-amber-200/50 shadow-[0_0_20px_rgba(240,207,152,0.12)]'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-sans">
                        <Mic className="w-3.5 h-3.5 text-amber-200/80" />
                        <span>Voice Message</span>
                      </div>
                      <h3 className="text-base font-serif text-ivory">{config.audio.voiceTitle || 'A message for you'}</h3>
                      <p className="text-[11px] text-zinc-400 font-sans">
                        Recorded for your ears only
                      </p>
                    </div>

                    <button
                      onClick={togglePlayVoice}
                      aria-label={activeMode === 'voice' ? 'Pause voice message' : 'Play voice message'}
                      className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600/60 flex items-center justify-center text-ivory hover:text-amber-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-200"
                    >
                      {activeMode === 'voice' ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Progress Slider */}
                  <div className="mt-3 space-y-1">
                    <div
                      className="w-full h-1.5 bg-zinc-800 rounded-full cursor-pointer overflow-hidden"
                      onClick={(e) => {
                        if (!voiceAudioRef.current) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        voiceAudioRef.current.currentTime = pos * (voiceAudioRef.current.duration || 1);
                      }}
                    >
                      <div
                        className="h-full bg-amber-200/90 rounded-full transition-all"
                        style={{ width: `${voiceProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] tabular-nums text-zinc-400">
                      <span>{voiceTime.current}</span>
                      <span>{voiceTime.total}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-zinc-400 font-sans italic">
                A quiet moment just for you.
              </p>
            </div>
          )}

          <p className="text-center text-xs text-zinc-400 font-sans italic pt-1">
            {config.audio.note}
          </p>
        </div>

        {/* Transition prompt leading into Chapter 05: The Sealed Letter */}
        <div className="pt-4 border-t border-zinc-800/80">
          <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-900/60 to-amber-500/5 border border-amber-200/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-widest text-amber-200/90">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Chapter 05 is waiting</span>
              </div>
              <h4 className="text-base sm:text-lg font-serif text-ivory">
                There's one last thing for you
              </h4>
              <p className="text-xs text-zinc-400 font-sans">
                A sealed envelope created with love, waiting to be opened.
              </p>
            </div>

            {onGoToNextChapter && (
              <button
                onClick={onGoToNextChapter}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-200 text-zinc-950 font-medium text-xs tracking-wider uppercase hover:bg-amber-100 transition-all shadow-md shrink-0"
              >
                <span>Open Chapter 05</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
