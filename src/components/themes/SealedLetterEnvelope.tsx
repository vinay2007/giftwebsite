/**
 * The Sealed Letter Theme Component
 * Vintage cream stationery surface with a burgundy wax seal that cracks and opens.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RotateCcw, Award } from 'lucide-react';
import { GiftConfig } from '../../config/giftConfig';

interface SealedLetterEnvelopeProps {
  config: GiftConfig;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const SealedLetterEnvelope: React.FC<SealedLetterEnvelopeProps> = ({
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
            key="sealed-closed"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20, transition: { duration: 0.5 } }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center py-6 w-full max-w-xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-center mb-8 space-y-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8a1c24]/15 border border-[#a82a33]/30 text-[#e8b4b8] text-xs font-serif italic mb-1">
                <Award className="w-3.5 h-3.5 text-[#d4a373]" />
                <span>Heritage Edition · For {config.recipientNickname}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-tight">
                A vintage letter sealed in burgundy wax
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light">
                Tap the wax crest to break the seal and read your letter
              </p>
            </motion.div>

            {/* Vintage Stationery Envelope */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Tap to crack the wax seal and open the letter"
              onClick={handleOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpen();
                }
              }}
              className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#d4a373]/70 rounded-2xl p-1 transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99]"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#8a1c24]/20 via-[#d4a373]/10 to-transparent blur-2xl group-hover:opacity-100 opacity-70 transition-opacity duration-700 pointer-events-none" />

              <div className="relative w-[310px] sm:w-[380px] md:w-[420px] aspect-16/10 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-[#d4a373]/30 bg-gradient-to-b from-[#251d18] via-[#1c1410] to-[#120d0a]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,163,115,0.18)_0%,transparent_75%)] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 420 262"
                  preserveAspectRatio="none"
                >
                  <polygon points="0,0 0,262 210,140" fill="#1b130f" opacity="0.9" />
                  <polygon points="420,0 420,262 210,140" fill="#17100c" opacity="0.9" />
                  <polygon points="0,262 420,262 210,135" fill="#241913" opacity="0.95" />
                  <line x1="0" y1="262" x2="210" y2="135" stroke="rgba(212,163,115,0.2)" strokeWidth="1" />
                  <line x1="420" y1="262" x2="210" y2="135" stroke="rgba(212,163,115,0.2)" strokeWidth="1" />
                </svg>

                {/* Top Flap */}
                <div
                  className="absolute top-0 inset-x-0 w-full h-[58%] origin-top transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    transform: isAnimating ? 'rotateX(180deg)' : 'rotateX(0deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <svg className="w-full h-full drop-shadow-md" viewBox="0 0 420 152" preserveAspectRatio="none">
                    <polygon points="0,0 420,0 210,152" fill="#2d221b" />
                    <line x1="0" y1="0" x2="210" y2="152" stroke="rgba(212,163,115,0.35)" strokeWidth="1.2" />
                    <line x1="420" y1="0" x2="210" y2="152" stroke="rgba(212,163,115,0.35)" strokeWidth="1.2" />
                  </svg>
                </div>

                {/* Burgundy Wax Seal */}
                <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#8a1c24] via-[#6d131a] to-[#40080d] p-0.5 shadow-[0_6px_20px_rgba(0,0,0,0.8)] border border-[#a82a33]/80 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5c0e14] to-[#7f1921] shadow-inner flex items-center justify-center border border-[#942028]/80">
                      <span className="font-serif text-amber-200 text-sm font-bold">W</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between pointer-events-none text-zinc-400 text-[10px] sm:text-xs">
                  <span className="font-serif italic text-[#d4a373] tracking-wider">
                    To {config.recipientNickname}
                  </span>
                  <span className="font-sans uppercase tracking-[0.2em] text-zinc-500 text-[9px]">
                    Handwritten
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center gap-2 text-xs font-sans text-[#d4a373] group-hover:text-[#e8b4b8] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-ping" />
              <span className="tracking-wide">Touch the burgundy wax seal to open</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed Letter View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sealed-revealed"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto py-6 space-y-8"
          >
            <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#d4a373]" />
                <span className="font-serif italic text-[#d4a373] text-sm">
                  Sealed Letter · For {config.recipientNickname}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-300 hover:text-white transition-all text-xs"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
                <span className="font-sans text-[11px]">Fold Envelope</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="relative w-full rounded-2xl bg-[#140e0b]/95 border border-[#d4a373]/30 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-7 sm:p-12 md:p-14 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8a1c24]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-2 sm:inset-3 rounded-xl border border-[#d4a373]/15 pointer-events-none" />

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
                    <div className="text-base sm:text-lg italic text-[#d4a373] whitespace-pre-line leading-relaxed">
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
