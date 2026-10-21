import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Star, Moon, Heart } from 'lucide-react';
import { GiftData } from '../../config/giftConfig';
import { CosmicBackground } from '../CosmicBackground';
import { ChapterNavigation } from '../ChapterNavigation';
import { Chapter01Opening } from '../Chapter01Opening';
import { Chapter02Memories } from '../Chapter02Memories';
import { Chapter03Letter } from '../Chapter03Letter';
import { Chapter04Reveal } from '../Chapter04Reveal';
import { Chapter05Envelope } from '../Chapter05Envelope';

interface MidnightRomanceThemeProps {
  gift: GiftData;
  onBackToEditor?: () => void;
  isPreviewMode?: boolean;
}

export const MidnightRomanceTheme: React.FC<MidnightRomanceThemeProps> = ({
  gift,
  onBackToEditor,
  isPreviewMode = false,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isOpeningEntered, setIsOpeningEntered] = useState(false);

  const fontClass = 'font-["Cormorant_Garamond",serif]';

  const resolvedChapters = React.useMemo(() => {
    const list = [...(gift.chapters || [])];
    if (!list.some((c) => c.id === 'envelope' || c.number === '05')) {
      list.push({
        id: 'envelope',
        number: '05',
        title: 'The sealed letter',
        subtitle: "There's one last thing for you",
        enabled: true,
      });
    }
    return list;
  }, [gift.chapters]);

  const handleNext = useCallback(() => {
    setActiveChapterIndex((prev) => Math.min(prev + 1, resolvedChapters.length - 1));
  }, [resolvedChapters.length]);

  const handlePrev = useCallback(() => {
    setActiveChapterIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleEnterFromOpening = () => {
    setIsOpeningEntered(true);
    setActiveChapterIndex(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      if (e.key === 'ArrowRight' && isOpeningEntered) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && isOpeningEntered) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpeningEntered, handleNext, handlePrev]);

  // Floating rose petals data
  const petals = [
    { left: '10%', top: '15%', delay: '0s', duration: '14s', size: 16, rot: 25 },
    { left: '25%', top: '5%', delay: '4s', duration: '18s', size: 20, rot: -40 },
    { left: '45%', top: '2%', delay: '7s', duration: '16s', size: 14, rot: 15 },
    { left: '70%', top: '8%', delay: '2s', duration: '20s', size: 22, rot: 60 },
    { left: '85%', top: '12%', delay: '6s', duration: '15s', size: 18, rot: -20 },
    { left: '92%', top: '4%', delay: '9s', duration: '17s', size: 15, rot: 35 },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-zinc-100 font-sans selection:bg-amber-300/20 selection:text-white overflow-hidden">
      {/* Dynamic Cosmic Background */}
      <CosmicBackground
        activeChapterIndex={activeChapterIndex}
        enableParallax={gift.settings.enableParallax}
        palette={gift.theme?.palette}
        animationIntensity={gift.theme?.animationIntensity}
      />

      {/* DECORATIVE LAYER 1: Hanging Fairy Lights Garland along the top border */}
      <div className="fixed top-0 inset-x-0 pointer-events-none z-20 flex justify-around px-4 select-none opacity-90">
        <svg className="absolute top-0 w-full h-12 stroke-amber-200/20 fill-none" preserveAspectRatio="none" viewBox="0 0 1000 50">
          <path d="M 0 10 Q 125 45 250 15 Q 375 45 500 15 Q 625 45 750 15 Q 875 45 1000 10" />
        </svg>
        {[
          { left: '8%', delay: '0s' },
          { left: '20%', delay: '1.2s' },
          { left: '32%', delay: '0.6s' },
          { left: '44%', delay: '2.1s' },
          { left: '56%', delay: '0.4s' },
          { left: '68%', delay: '1.8s' },
          { left: '80%', delay: '0.9s' },
          { left: '92%', delay: '1.5s' },
        ].map((light, i) => (
          <div
            key={i}
            className="absolute top-3 flex flex-col items-center animate-fairy-light"
            style={{ left: light.left, animationDelay: light.delay }}
          >
            <div className="w-0.5 h-3 bg-amber-100/30" />
            <div className="w-2.5 h-3 rounded-full bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 shadow-[0_0_12px_rgba(255,220,150,0.9)]" />
          </div>
        ))}
      </div>

      {/* DECORATIVE LAYER 2: Gently Falling Rose Petals */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {petals.map((p, idx) => (
          <div
            key={idx}
            className="absolute opacity-0 animate-[driftPetal_16s_ease-in-out_infinite]"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          >
            {/* SVG Rose Petal Silhouette */}
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 24 32"
              fill="none"
              style={{ transform: `rotate(${p.rot}deg)` }}
              className="drop-shadow-[0_2px_8px_rgba(200,40,70,0.3)] opacity-70"
            >
              <path
                d="M 12 0 C 18 4 24 12 22 22 C 20 28 14 32 12 32 C 10 32 4 28 2 22 C 0 12 6 4 12 0 Z"
                fill="url(#petalGrad)"
              />
              <defs>
                <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e63946" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#9d0208" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#6a040f" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        ))}
      </div>

      {/* DECORATIVE LAYER 3: Hanging Starlight Constellations in Corner */}
      <div className="fixed top-8 right-8 pointer-events-none z-10 opacity-30 hidden sm:flex items-center gap-2">
        <Star className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
        <div className="w-8 h-px bg-amber-200/40" />
        <Star className="w-2.5 h-2.5 text-amber-100" />
      </div>

      {/* Preview top bar */}
      {isPreviewMode && onBackToEditor && (
        <div className="fixed top-5 left-5 z-50">
          <button
            onClick={onBackToEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-700/80 hover:border-amber-200/50 text-zinc-300 hover:text-white text-xs backdrop-blur-md shadow-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-sans text-[11px]">Back to Editor</span>
          </button>
        </div>
      )}

      {/* Top Bar Navigation */}
      {isOpeningEntered && (
        <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-8 px-6 md:px-12 py-5 border-b border-zinc-800/40 bg-zinc-950/40 backdrop-blur-md">
          <button
            onClick={() => setActiveChapterIndex(0)}
            className={`text-base sm:text-lg italic text-zinc-200 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-none ${fontClass}`}
          >
            {gift.siteTitle || gift.title}
          </button>
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest text-zinc-400">
            {resolvedChapters.map((chap, idx) => (
              <button
                key={chap.id}
                onClick={() => setActiveChapterIndex(idx)}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b ${
                  activeChapterIndex === idx
                    ? 'border-amber-200/90 text-zinc-100 font-medium'
                    : 'border-transparent hover:text-zinc-200'
                }`}
              >
                {chap.number}. {chap.title}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-xs italic text-zinc-400 ${fontClass}`}>
              For {gift.recipientNickname || 'you'}
            </span>
          </div>
        </header>
      )}

      {/* Main Chapter Content */}
      <main className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeChapterIndex === 0 && (
            <motion.div
              key="ch-01"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <Chapter01Opening config={gift} onEnter={handleEnterFromOpening} />
            </motion.div>
          )}
          {activeChapterIndex === 1 && (
            <motion.div
              key="ch-02"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="w-full"
            >
              <Chapter02Memories photos={gift.photos} recipientNickname={gift.recipientNickname} />
            </motion.div>
          )}
          {activeChapterIndex === 2 && (
            <motion.div
              key="ch-03"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="w-full"
            >
              <Chapter03Letter config={gift} />
            </motion.div>
          )}
          {activeChapterIndex === 3 && (
            <motion.div
              key="ch-04"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="w-full"
            >
              <Chapter04Reveal config={gift} onGoToNextChapter={() => setActiveChapterIndex(4)} />
            </motion.div>
          )}
          {activeChapterIndex === 4 && (
            <motion.div
              key="ch-05"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="w-full"
            >
              <Chapter05Envelope config={gift} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ChapterNavigation
        chapters={resolvedChapters}
        activeChapterIndex={activeChapterIndex}
        onSelectChapter={(idx) => {
          setIsOpeningEntered(true);
          setActiveChapterIndex(idx);
        }}
        onNext={handleNext}
        onPrev={handlePrev}
        isOpeningEntered={isOpeningEntered}
      />
    </div>
  );
};
