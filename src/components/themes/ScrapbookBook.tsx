/**
 * Scrapbook of Us Theme Component
 * Handmade memory journal with Polaroid frames and washi tape accents.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import { GiftConfig } from '../../config/giftConfig';

interface ScrapbookBookProps {
  config: GiftConfig;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const ScrapbookBook: React.FC<ScrapbookBookProps> = ({
  config,
  onOpenStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const rawParagraphs = config.letter?.paragraphs || [];
  const validParagraphs = rawParagraphs.filter((p) => p && p.trim().length > 0);

  const handleOpenBook = () => {
    if (isOpen || isAnimating) return;
    setIsAnimating(true);
    setIsOpen(true);
    if (onOpenStateChange) onOpenStateChange(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const handleCloseBook = () => {
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
            key="scrapbook-closed"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs font-serif italic mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Handmade Journal · For {config.recipientNickname}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-tight">
                A scrapbook filled with our favorite moments
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light">
                Tap the scrapbook cover to open the journal and read your letter
              </p>
            </motion.div>

            {/* Interactive Scrapbook Object */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Tap to open scrapbook and read letter"
              onClick={handleOpenBook}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenBook();
                }
              }}
              className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 rounded-2xl p-2 transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99]"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-600/15 via-amber-200/10 to-transparent blur-2xl group-hover:opacity-100 opacity-70 transition-opacity pointer-events-none" />

              <div className="relative w-[320px] sm:w-[380px] aspect-4/3 rounded-xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-amber-300/30 bg-gradient-to-br from-[#2b221a] via-[#1c1612] to-[#120d0a] p-6 flex flex-col justify-between">
                {/* Washi tape graphic */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-amber-200/25 rotate-[-1deg] backdrop-blur-sm border border-amber-100/20" />

                <div className="text-center pt-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70 font-sans block">
                    Memory Archive
                  </span>
                  <h4 className="text-xl font-serif text-ivory mt-1">
                    Our Scrapbook
                  </h4>
                </div>

                <div className="flex justify-center items-center py-4">
                  <div className="w-20 h-20 rounded-lg bg-zinc-900/90 border border-amber-200/30 p-1.5 shadow-md rotate-2 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-amber-200/80" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 pb-2">
                  <span className="font-serif italic text-amber-100/70">
                    For {config.recipientNickname}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-zinc-500">
                    Tap to Open
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center gap-2 text-xs font-sans text-amber-200 group-hover:text-amber-100 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
              <span className="tracking-wide">Touch the book cover to open</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed Letter View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="scrapbook-revealed"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto py-6 space-y-8"
          >
            <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-200" />
                <span className="font-serif italic text-amber-200 text-sm">
                  Scrapbook of Us · For {config.recipientNickname}
                </span>
              </div>
              <button
                onClick={handleCloseBook}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-300 hover:text-white transition-all text-xs"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
                <span className="font-sans text-[11px]">Close Scrapbook</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="relative w-full rounded-2xl bg-[#171311]/95 border border-amber-300/30 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-7 sm:p-12 md:p-14 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-2 sm:inset-3 rounded-xl border border-amber-100/10 pointer-events-none" />

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
                    <div className="text-base sm:text-lg italic text-amber-200 whitespace-pre-line leading-relaxed">
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
