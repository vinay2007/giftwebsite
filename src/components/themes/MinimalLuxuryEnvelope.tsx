/**
 * Minimal Luxury Theme Component
 * Minimalist envelope secured with a black ribbon on a clean editorial surface.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Layers, RotateCcw } from 'lucide-react';
import { GiftConfig } from '../../config/giftConfig';

interface MinimalLuxuryEnvelopeProps {
  config: GiftConfig;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const MinimalLuxuryEnvelope: React.FC<MinimalLuxuryEnvelopeProps> = ({
  config,
  onOpenStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const rawParagraphs = config.letter?.paragraphs || [];
  const validParagraphs = rawParagraphs.filter((p) => p && p.trim().length > 0);

  const handleOpen = () => {
    if (isOpen || isAnimating) return;
    setIsAnimating(true);
    setIsOpen(true);
    if (onOpenStateChange) onOpenStateChange(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
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
            key="minimal-closed"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/10 border border-zinc-200/20 text-zinc-300 text-xs font-serif italic mb-1">
                <Sparkles className="w-3.5 h-3.5 text-zinc-100 animate-pulse" />
                <span>Editorial Edition · For {config.recipientNickname}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-tight">
                A minimalist envelope secured with black ribbon
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light">
                Tap to loosen the ribbon and glide your letter into view
              </p>
            </motion.div>

            {/* Minimalist Envelope Object */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Tap to open minimalist envelope"
              onClick={handleOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpen();
                }
              }}
              className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/70 rounded-2xl p-1 transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99]"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-zinc-600/15 via-zinc-200/10 to-transparent blur-2xl group-hover:opacity-100 opacity-70 transition-opacity pointer-events-none" />

              <div className="relative w-[310px] sm:w-[380px] md:w-[420px] aspect-16/10 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-zinc-700 bg-gradient-to-b from-[#1c1c1e] via-[#141416] to-[#0c0c0e] p-8 flex flex-col justify-between">
                {/* Black Ribbon simulation across center */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 bg-black shadow-lg border-y border-zinc-700/60 z-20 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-600 shadow-md flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  </div>
                </div>

                <div className="text-center pt-2 z-10">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-sans block">
                    Editorial Collection
                  </span>
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between pointer-events-none text-zinc-400 text-[10px] sm:text-xs z-10">
                  <span className="font-serif italic text-zinc-300 tracking-wider">
                    To {config.recipientNickname}
                  </span>
                  <span className="font-sans uppercase tracking-[0.2em] text-zinc-500 text-[9px]">
                    Sculptural
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center gap-2 text-xs font-sans text-zinc-300 group-hover:text-white transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-ping" />
              <span className="tracking-wide">Touch envelope to glide letter open</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed Letter View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="minimal-revealed"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto py-6 space-y-8"
          >
            <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-zinc-300" />
                <span className="font-serif italic text-zinc-200 text-sm">
                  Minimal Luxury · For {config.recipientNickname}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-300 hover:text-white transition-all text-xs"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
                <span className="font-sans text-[11px]">Secure Ribbon</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="relative w-full rounded-2xl bg-[#141416]/95 border border-zinc-700 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-7 sm:p-12 md:p-14 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-2 sm:inset-3 rounded-xl border border-zinc-100/10 pointer-events-none" />

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
                    <div className="text-base sm:text-lg italic text-zinc-300 whitespace-pre-line leading-relaxed">
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
