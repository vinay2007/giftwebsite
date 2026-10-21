/**
 * Starlight Memories Theme Component
 * Midnight navy field where scattered stars connect into a constellation.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, RotateCcw } from 'lucide-react';
import { GiftConfig } from '../../config/giftConfig';

interface StarlightConstellationProps {
  config: GiftConfig;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const StarlightConstellation: React.FC<StarlightConstellationProps> = ({
  config,
  onOpenStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const rawParagraphs = config.letter?.paragraphs || [];
  const validParagraphs = rawParagraphs.filter((p) => p && p.trim().length > 0);

  const handleConnect = () => {
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
            key="starlight-closed"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs font-serif italic mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
                <span>Celestial Edition · For {config.recipientNickname}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-tight">
                A constellation formed in the night sky
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light">
                Tap the star field to connect the stars and reveal your letter
              </p>
            </motion.div>

            {/* Interactive Constellation Sphere */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Tap to connect constellation stars and open letter"
              onClick={handleConnect}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleConnect();
                }
              }}
              className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 rounded-full p-4 transition-transform duration-500 hover:scale-105 active:scale-95"
            >
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-transparent blur-3xl group-hover:opacity-100 opacity-70 transition-opacity pointer-events-none" />

              <div className="relative w-64 h-64 rounded-full bg-gradient-to-b from-[#0f142b] via-[#060813] to-[#030408] border border-blue-400/30 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(140,166,255,0.35)_0%,transparent_70%)]" />

                {/* Star points */}
                <div className="absolute top-12 left-16 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                <div className="absolute top-20 right-16 w-2.5 h-2.5 rounded-full bg-blue-200 shadow-[0_0_10px_white]" />
                <div className="absolute bottom-16 left-20 w-2 h-2 rounded-full bg-amber-100 shadow-[0_0_8px_white]" />
                <div className="absolute bottom-20 right-20 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-300 shadow-[0_0_15px_blue] animate-pulse" />

                {/* SVG Connecting lines simulation */}
                <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 256 256">
                  <line x1="64" y1="48" x2="128" y2="128" stroke="rgba(140,166,255,0.4)" strokeWidth="1.5" />
                  <line x1="192" y1="80" x2="128" y2="128" stroke="rgba(140,166,255,0.4)" strokeWidth="1.5" />
                  <line x1="80" y1="208" x2="128" y2="128" stroke="rgba(140,166,255,0.4)" strokeWidth="1.5" />
                  <line x1="176" y1="192" x2="128" y2="128" stroke="rgba(140,166,255,0.4)" strokeWidth="1.5" />
                </svg>

                <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none z-10">
                  <span className="font-serif italic text-blue-200 text-xs">
                    Connect stars for {config.recipientNickname}
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center gap-2 text-xs font-sans text-blue-300 group-hover:text-blue-200 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span className="tracking-wide">Touch the star field to reveal letter</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed Letter View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="starlight-revealed"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto py-6 space-y-8"
          >
            <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-serif italic text-blue-200 text-sm">
                  Starlight Memories · For {config.recipientNickname}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-300 hover:text-white transition-all text-xs"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
                <span className="font-sans text-[11px]">View Constellation</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="relative w-full rounded-2xl bg-[#090d1a]/95 border border-blue-400/30 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-7 sm:p-12 md:p-14 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-2 sm:inset-3 rounded-xl border border-blue-100/10 pointer-events-none" />

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
                    <div className="text-base sm:text-lg italic text-blue-200 whitespace-pre-line leading-relaxed">
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
