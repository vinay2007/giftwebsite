import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Flower, Leaf, Heart, Music, Mic, Play, Pause, Compass } from 'lucide-react';
import { GiftData } from '../../config/giftConfig';
import { ambientSynthesizer } from '../../utils/audioSynthesizer';

interface SecretGardenThemeProps {
  gift: GiftData;
  onBackToEditor?: () => void;
  isPreviewMode?: boolean;
}

export const SecretGardenTheme: React.FC<SecretGardenThemeProps> = ({
  gift,
  onBackToEditor,
  isPreviewMode = false,
}) => {
  const [activeStep, setActiveStep] = useState<'path' | 'memories' | 'letter' | 'audio' | 'reveal'>('path');
  const [petalsScattered, setPetalsScattered] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Audio states
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const songAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSong = () => {
    if (!songAudioRef.current) return;
    if (isPlayingSong) {
      songAudioRef.current.pause();
      setIsPlayingSong(false);
    } else {
      songAudioRef.current.play().then(() => setIsPlayingSong(true)).catch(() => {
        ambientSynthesizer.play();
      });
    }
  };

  const toggleVoice = () => {
    if (!voiceAudioRef.current) return;
    if (isPlayingVoice) {
      voiceAudioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      voiceAudioRef.current.play().then(() => setIsPlayingVoice(true)).catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      songAudioRef.current?.pause();
      voiceAudioRef.current?.pause();
      ambientSynthesizer.stop();
    };
  }, []);

  // Falling petals data for garden
  const gardenPetals = [
    { left: '12%', delay: '0s', duration: '12s', size: 14, rot: 15 },
    { left: '28%', delay: '3s', duration: '16s', size: 18, rot: -30 },
    { left: '50%', delay: '6s', duration: '14s', size: 12, rot: 45 },
    { left: '72%', delay: '1.5s', duration: '18s', size: 20, rot: -15 },
    { left: '88%', delay: '4.5s', duration: '15s', size: 16, rot: 35 },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#f2f5f0] text-[#243024] font-serif selection:bg-[#4a6b4a]/20 overflow-x-hidden">
      {/* Hidden audio tags */}
      {gift.audio.songSrc && (
        <audio ref={songAudioRef} src={gift.audio.songSrc} onEnded={() => setIsPlayingSong(false)} />
      )}
      {gift.audio.voiceSrc && (
        <audio ref={voiceAudioRef} src={gift.audio.voiceSrc} onEnded={() => setIsPlayingVoice(false)} />
      )}

      {/* DECORATIVE LAYER 1: Botanical Flowering Vines Arch across top corners */}
      <div className="fixed top-0 left-0 pointer-events-none z-20 w-48 sm:w-64 h-48 select-none opacity-85">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          {/* Main Vine */}
          <path d="M 0 0 C 40 30, 70 80, 90 140 C 100 170, 80 190, 60 200" stroke="#3c5a3c" strokeWidth="3" strokeLinecap="round" />
          <path d="M 0 0 C 70 10, 130 50, 160 110" stroke="#4a6b4a" strokeWidth="2" strokeLinecap="round" />
          
          {/* Leaves */}
          <path d="M 30 25 C 20 15, 35 5, 50 20 C 40 35, 30 25, 30 25 Z" fill="#608060" />
          <path d="M 60 65 C 50 55, 65 45, 80 60 C 70 75, 60 65, 60 65 Z" fill="#4a6b4a" />
          <path d="M 85 125 C 75 115, 90 105, 105 120 C 95 135, 85 125, 85 125 Z" fill="#527852" />
          <path d="M 120 40 C 110 30, 125 20, 140 35 C 130 50, 120 40, 120 40 Z" fill="#608060" />

          {/* Rose/Jasmine Blossoms */}
          <circle cx="55" cy="40" r="8" fill="#f4a261" opacity="0.9" />
          <circle cx="55" cy="40" r="5" fill="#e76f51" />
          <circle cx="115" cy="85" r="9" fill="#f8edeb" stroke="#e07a5f" strokeWidth="1" />
          <circle cx="115" cy="85" r="4" fill="#e07a5f" />
        </svg>
      </div>

      <div className="fixed top-0 right-0 pointer-events-none z-20 w-48 sm:w-64 h-48 select-none opacity-85 scale-x-[-1]">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <path d="M 0 0 C 40 30, 70 80, 90 140 C 100 170, 80 190, 60 200" stroke="#3c5a3c" strokeWidth="3" strokeLinecap="round" />
          <path d="M 0 0 C 70 10, 130 50, 160 110" stroke="#4a6b4a" strokeWidth="2" strokeLinecap="round" />
          <path d="M 30 25 C 20 15, 35 5, 50 20 C 40 35, 30 25, 30 25 Z" fill="#608060" />
          <path d="M 60 65 C 50 55, 65 45, 80 60 C 70 75, 60 65, 60 65 Z" fill="#4a6b4a" />
          <circle cx="55" cy="40" r="8" fill="#f4a261" opacity="0.9" />
          <circle cx="55" cy="40" r="5" fill="#e76f51" />
        </svg>
      </div>

      {/* DECORATIVE LAYER 2: Fluttering Illustrated Butterflies */}
      <div className="fixed top-24 left-1/4 pointer-events-none z-20 hidden md:block animate-float-1">
        <div className="flex items-center gap-1 animate-flutter">
          <svg width="28" height="24" viewBox="0 0 32 28" fill="none">
            <path d="M 16 14 C 10 4, 2 6, 4 16 C 6 22, 14 18, 16 14 Z" fill="#f4a261" opacity="0.85" />
            <path d="M 16 14 C 22 4, 30 6, 28 16 C 26 22, 18 18, 16 14 Z" fill="#e76f51" opacity="0.85" />
            <line x1="16" y1="8" x2="16" y2="22" stroke="#243024" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <div className="fixed top-48 right-1/4 pointer-events-none z-20 hidden md:block animate-float-2">
        <div className="flex items-center gap-1 animate-flutter" style={{ animationDelay: '0.3s' }}>
          <svg width="22" height="18" viewBox="0 0 32 28" fill="none">
            <path d="M 16 14 C 10 4, 2 6, 4 16 C 6 22, 14 18, 16 14 Z" fill="#ffd166" opacity="0.9" />
            <path d="M 16 14 C 22 4, 30 6, 28 16 C 26 22, 18 18, 16 14 Z" fill="#f4a261" opacity="0.9" />
            <line x1="16" y1="8" x2="16" y2="22" stroke="#243024" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      {/* DECORATIVE LAYER 3: Hanging Garden Lanterns */}
      <div className="fixed top-14 left-10 pointer-events-none z-20 hidden sm:flex flex-col items-center">
        <div className="w-0.5 h-16 bg-[#3c5a3c]" />
        <div className="w-7 h-9 rounded-lg bg-gradient-to-b from-[#ffd166] to-[#f4a261] border border-[#3c5a3c] shadow-[0_0_15px_rgba(255,209,102,0.8)] flex items-center justify-center animate-pulse">
          <div className="w-2 h-4 rounded-full bg-white opacity-80" />
        </div>
      </div>

      <div className="fixed top-14 right-10 pointer-events-none z-20 hidden sm:flex flex-col items-center">
        <div className="w-0.5 h-20 bg-[#3c5a3c]" />
        <div className="w-7 h-9 rounded-lg bg-gradient-to-b from-[#ffd166] to-[#f4a261] border border-[#3c5a3c] shadow-[0_0_15px_rgba(255,209,102,0.8)] flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="w-2 h-4 rounded-full bg-white opacity-80" />
        </div>
      </div>

      {/* DECORATIVE LAYER 4: Falling Garden Blossoms / Petals */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {gardenPetals.map((p, idx) => (
          <div
            key={idx}
            className="absolute opacity-0 animate-[driftPetal_14s_ease-in-out_infinite]"
            style={{
              left: p.left,
              top: '5%',
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          >
            <svg
              width={p.size}
              height={p.size * 1.2}
              viewBox="0 0 20 24"
              fill="none"
              style={{ transform: `rotate(${p.rot}deg)` }}
            >
              <path
                d="M 10 0 C 15 4, 20 10, 18 18 C 16 22, 12 24, 10 24 C 8 24, 4 22, 2 18 C 0 10, 5 4, 10 0 Z"
                fill="#f4a261"
                opacity="0.65"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Preview Top Bar */}
      {isPreviewMode && onBackToEditor && (
        <div className="fixed top-4 left-4 z-50 font-sans">
          <button
            onClick={onBackToEditor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-[#4a6b4a]/30 text-[#243024] text-xs font-semibold shadow-md backdrop-blur-md transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px]">Back to Editor</span>
          </button>
        </div>
      )}

      {/* Botanical Header */}
      <header className="sticky top-0 z-40 bg-[#f2f5f0]/95 backdrop-blur-md border-b border-[#243024]/15 px-6 sm:px-12 py-3.5 flex items-center justify-between font-sans">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-[#4a6b4a]" />
          <span className="font-serif italic font-bold text-lg text-[#243024] tracking-wide">
            {gift.siteTitle || gift.title}
          </span>
        </div>

        {/* Garden Flower Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-xs">
          {[
            { id: 'path', label: 'Garden Path 🌿' },
            { id: 'memories', label: 'Blooming Memories 🌸' },
            { id: 'letter', label: 'Botanical Letter 📜' },
            { id: 'audio', label: 'Garden Songs 🎶' },
            { id: 'reveal', label: 'Final Blossom 🌺' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveStep(item.id as typeof activeStep)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all text-xs ${
                activeStep === item.id
                  ? 'bg-[#4a6b4a] text-white font-semibold shadow-sm'
                  : 'text-[#243024]/80 hover:text-[#243024] hover:bg-[#e2eae0]'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <span className="text-xs italic text-[#4a6b4a] font-serif font-bold bg-[#4a6b4a]/10 px-3 py-1 rounded-full border border-[#4a6b4a]/20">
          🌿 For {gift.recipientNickname || 'you'}
        </span>
      </header>

      {/* Mobile Garden Nav */}
      <div className="md:hidden flex overflow-x-auto gap-2 p-2.5 bg-[#e2eae0] border-b border-[#243024]/10 scrollbar-none font-sans font-medium text-xs">
        {[
          { id: 'path', label: 'Path 🌿' },
          { id: 'memories', label: 'Memories 🌸' },
          { id: 'letter', label: 'Letter 📜' },
          { id: 'audio', label: 'Songs 🎶' },
          { id: 'reveal', label: 'Blossom 🌺' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveStep(item.id as typeof activeStep)}
            className={`px-3 py-1 rounded-full text-xs shrink-0 whitespace-nowrap ${
              activeStep === item.id
                ? 'bg-[#4a6b4a] text-white font-semibold'
                : 'bg-white/80 text-[#243024] border border-[#243024]/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Garden Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
        <AnimatePresence mode="wait">
          {activeStep === 'path' && (
            <motion.div
              key="path"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 py-8"
            >
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-[#4a6b4a]/15 border-2 border-[#4a6b4a]/30 flex items-center justify-center mx-auto text-[#4a6b4a] shadow-inner">
                  <Flower className="w-10 h-10 animate-spin" style={{ animationDuration: '30s' }} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#f4a261] border border-white flex items-center justify-center text-xs">
                  ✨
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#4a6b4a] font-bold">
                  Secret Garden Storybook
                </span>
                <h1 className="text-4xl sm:text-6xl font-serif text-[#243024] font-normal tracking-tight leading-tight text-balance">
                  A blossoming sanctuary planted with love for <span className="italic text-[#4a6b4a] underline decoration-[#f4a261] decoration-wavy">{gift.recipientNickname}</span>.
                </h1>
                <p className="text-base text-[#243024]/80 font-sans font-light max-w-lg mx-auto leading-relaxed">
                  {gift.opening.tagline}. Stroll through the winding arbor where every blossom reveals an intimate memory.
                </p>
              </div>

              {/* Illustrated Winding Stone Path preview */}
              <div className="py-4 flex justify-center">
                <svg className="w-64 h-24 stroke-[#4a6b4a]/40 fill-none" viewBox="0 0 300 100">
                  <path d="M 20 80 Q 80 20, 150 70 T 280 30" strokeWidth="4" strokeDasharray="6 6" />
                  <circle cx="20" cy="80" r="8" fill="#4a6b4a" />
                  <circle cx="150" cy="70" r="8" fill="#f4a261" />
                  <circle cx="280" cy="30" r="8" fill="#e76f51" />
                </svg>
              </div>

              <div>
                <button
                  onClick={() => setActiveStep('memories')}
                  className="px-8 py-3.5 rounded-full bg-[#4a6b4a] hover:bg-[#3d5a3d] text-white font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-lg hover:scale-105"
                >
                  Step onto the Garden Path 🌿
                </button>
              </div>
            </motion.div>
          )}

          {activeStep === 'memories' && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#4a6b4a] font-sans font-bold">
                  Along the Winding Arbor
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#243024]">
                  Blooming Keepsakes
                </h2>
                <p className="text-xs font-sans text-[#243024]/70">
                  Each petal guards a quiet moment. Tap any frame to inspect it.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {gift.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className="group cursor-pointer bg-[#fafbf7] p-5 rounded-3xl border-2 border-[#4a6b4a]/25 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Corner Botanical Leaf Accents */}
                    <div className="absolute top-2 right-2 text-[#4a6b4a]/40">
                      <Leaf className="w-4 h-4" />
                    </div>

                    <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#e2eae0] mb-4 border border-[#4a6b4a]/20 shadow-inner">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="font-serif italic text-base text-[#243024] font-medium leading-relaxed">
                      "{photo.caption}"
                    </p>
                    <span className="text-[11px] font-sans font-bold text-[#4a6b4a] block mt-2.5">
                      🌸 {photo.dateOrLocation || `Blossom 0${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeStep === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Petal scattering interactive reveal banner */}
              {!petalsScattered && (
                <div className="p-4 rounded-2xl bg-[#ffd166]/30 border border-[#f4a261]/40 flex items-center justify-between gap-4 font-sans text-xs">
                  <div className="flex items-center gap-2">
                    <Flower className="w-5 h-5 text-[#e76f51] shrink-0" />
                    <span>Petals are gently resting over your love letter.</span>
                  </div>
                  <button
                    onClick={() => setPetalsScattered(true)}
                    className="px-4 py-1.5 rounded-full bg-[#4a6b4a] text-white font-bold hover:bg-[#3d5a3d] shrink-0"
                  >
                    Scatter Petals 🌸
                  </button>
                </div>
              )}

              {/* Botanical Letter Paper */}
              <div className="bg-[#fafbf7] rounded-3xl border-2 border-[#4a6b4a]/30 shadow-2xl p-8 sm:p-14 space-y-6 relative overflow-hidden">
                {/* Botanical watermark */}
                <div className="absolute top-6 right-6 text-[#4a6b4a]/20">
                  <Leaf className="w-16 h-16" />
                </div>

                <div className="flex items-center gap-2 text-xs font-sans text-[#4a6b4a] uppercase tracking-widest font-bold pb-2 border-b border-[#4a6b4a]/20">
                  <span>Botanical Parchment</span>
                  <span>·</span>
                  <span>From {gift.senderNickname}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif text-[#243024] font-normal">
                  {gift.letter.salutation}
                </h3>

                <div className="space-y-4 font-serif text-lg text-[#243024]/90 leading-relaxed font-light">
                  {gift.letter.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#4a6b4a]/20 text-right font-serif italic text-lg text-[#4a6b4a] font-medium">
                  {gift.letter.signOff}
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 'audio' && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif text-[#243024]">Garden Songs & Voice</h2>
                <p className="text-xs font-sans text-[#243024]/70">
                  Sweet melodies whispering through the arbor leaves.
                </p>
              </div>

              <div className="grid gap-4">
                {gift.audio.songSrc && (
                  <div className="p-6 rounded-3xl bg-[#fafbf7] border-2 border-[#4a6b4a]/30 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleSong}
                        className="w-12 h-12 rounded-full bg-[#4a6b4a] text-white flex items-center justify-center shadow-md hover:bg-[#3d5a3d]"
                      >
                        {isPlayingSong ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#243024]">{gift.audio.songTitle}</h4>
                        <span className="text-xs font-sans text-[#4a6b4a]">Enchanted Garden Track</span>
                      </div>
                    </div>
                  </div>
                )}

                {gift.audio.voiceSrc && (
                  <div className="p-6 rounded-3xl bg-[#fafbf7] border-2 border-[#4a6b4a]/30 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleVoice}
                        className="w-12 h-12 rounded-full bg-[#87a387] text-white flex items-center justify-center shadow-md hover:bg-[#729072]"
                      >
                        {isPlayingVoice ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#243024]">{gift.audio.voiceTitle}</h4>
                        <span className="text-xs font-sans text-[#4a6b4a]">Spoken from the Heart</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeStep === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto text-center bg-[#fafbf7] border-2 border-[#4a6b4a]/40 rounded-3xl p-8 sm:p-14 space-y-6 shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#4a6b4a]/15 border border-[#4a6b4a]/30 flex items-center justify-center mx-auto text-[#4a6b4a]">
                <Flower className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif text-[#243024]">
                {gift.finalReveal.title}
              </h2>
              <p className="text-xl font-serif italic text-[#243024] leading-relaxed">
                "{gift.finalReveal.birthdayWish}"
              </p>
              <p className="text-sm font-sans text-[#243024]/75">
                {gift.finalReveal.closingProse}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <div
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fafbf7] p-6 rounded-3xl border-2 border-[#4a6b4a] shadow-2xl max-w-lg w-full space-y-4 font-serif"
            >
              <div className="aspect-4/3 rounded-2xl overflow-hidden border border-[#4a6b4a]/20 bg-black">
                <img
                  src={gift.photos[selectedPhotoIndex].src}
                  alt={gift.photos[selectedPhotoIndex].alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-lg italic text-center text-[#243024]">
                "{gift.photos[selectedPhotoIndex].caption}"
              </p>
              <div className="text-center pt-2 font-sans">
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="px-6 py-2 bg-[#4a6b4a] text-white rounded-full text-xs font-bold uppercase tracking-widest"
                >
                  Return to Path
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
