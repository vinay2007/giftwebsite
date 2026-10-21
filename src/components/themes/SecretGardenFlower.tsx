/**
 * Secret Garden Theme Component
 * Features a closed flower bud that slowly blooms and unfolds its petals to reveal the letter.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flower2, RotateCcw } from 'lucide-react';
import { GiftConfig } from '../../config/giftConfig';

interface SecretGardenFlowerProps {
  config: GiftConfig;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const SecretGardenFlower: React.FC<SecretGardenFlowerProps> = ({
  config,
  onOpenStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const rawParagraphs = config.letter?.paragraphs || [];
  const validParagraphs = rawParagraphs.filter((p) => p && p.trim().length > 0);

  const handleBloom = () => {
    if (isOpen || isAnimating) return;
    setIsAnimating(true);
    setIsOpen(true);
    if (onOpenStateChange) onOpenStateChange(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1100);
  };

  const handleClose = () => {
    if (!isOpen || isAnimating) return;
    setIsAnimating(true);
    setIsOpen(false);
    if (onOpenStateChange) onOpenStateChange(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="garden-closed"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.5 } }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center py-6 w-full max-w-xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-center mb-8 space-y-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-serif italic mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>Botanical Edition · For {config.recipientNickname}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-tight">
                A secret flower bud waiting to bloom
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light">
                Tap the botanical bud to watch it bloom and reveal your letter
              </p>
            </motion.div>

            {/* Interactive Flower Bud */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Tap to bloom the flower bud and open your letter"
              onClick={handleBloom}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBloom();
                }
              }}
              className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 rounded-full p-4 transition-transform duration-500 hover:scale-105 active:scale-95"
            >
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-emerald-500/15 via-rose-500/10 to-transparent blur-3xl group-hover:opacity-100 opacity-70 transition-opacity pointer-events-none" />

              <div className="relative w-56 h-56 rounded-full bg-gradient-to-b from-[#13221b] via-[#0b1410] to-[#070b09] border border-emerald-500/30 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_50%_40%,rgba(163,193,173,0.4)_0%,transparent_70%)]" />

                {/* Animated Bud SVG */}
                <motion.div
                  animate={{
                    scale: [1, 1.04, 1],
                    rotate: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-28 rounded-t-full rounded-b-2xl bg-gradient-to-tr from-[#d48c9c] via-[#e2adb9] to-[#f4d1d8] shadow-2xl border border-rose-200/40 flex items-center justify-center">
                    <Flower2 className="w-8 h-8 text-[#68192a]/80" />
                  </div>
                  {/* Stem & Leaves */}
                  <div className="w-1.5 h-12 bg-emerald-700 rounded-full -mt-1 relative">
                    <div className="absolute top-2 -left-3 w-4 h-2.5 bg-emerald-600 rounded-full rotate-[-30deg]" />
                    <div className="absolute top-6 -right-3 w-4 h-2.5 bg-emerald-600 rounded-full rotate-[30deg]" />
                  </div>
                </motion.div>

                <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
                  <span className="font-serif italic text-emerald-200 text-xs">
                    Tap to bloom for {config.recipientNickname}
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center gap-2 text-xs font-sans text-emerald-300 group-hover:text-emerald-200 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="tracking-wide">Touch the flower to unfold petals</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed Letter View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="garden-revealed"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto py-6 space-y-8"
          >
            <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Flower2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-serif italic text-emerald-200 text-sm">
                  Secret Garden · For {config.recipientNickname}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-300 hover:text-white transition-all text-xs"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
                <span className="font-sans text-[11px]">Close Flower Bud</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="relative w-full rounded-2xl bg-[#0e1713]/95 border border-emerald-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-7 sm:p-12 md:p-14 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-2 sm:inset-3 rounded-xl border border-emerald-100/10 pointer-events-none" />

              <div className="relative z-10 space-y-6 sm:space-y-8 max-h-[65vh] sm:max-h-[72vh] overflow-y-auto pr-2 sm:pr-4 select-text custom-scrollbar">
                {config.letter?.salutation && (
                  <h4 className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-wide text-balance leading-snug">
                    {config.letter.salutation}
                  </h4>
                )}
                <div className="space-y-5 text-base sm:text-lg font-serif text-zinc-200/95 leading-relaxed sm:leading-loose tracking-wide font-light">
                  {validParagraphs.map((paragraph, idx) => (
                    <p key={idx} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {config.letter?.signOff && (
                  <div className="pt-6 sm:pt-8 text-right font-serif">
                    <div className="text-base sm:text-lg italic text-emerald-200 whitespace-pre-line leading-relaxed">
                      {config.letter.signOff}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
