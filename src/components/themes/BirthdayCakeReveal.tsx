/**
 * Birthday Cake Surprise - Interactive 3-Tier Cake Reveal Component
 * Features flickering candles, dimming lights, and smooth letter slide-out.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RotateCcw, Flame } from 'lucide-react';
import { GiftConfig } from '../../config/giftConfig';

interface BirthdayCakeRevealProps {
  config: GiftConfig;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const BirthdayCakeReveal: React.FC<BirthdayCakeRevealProps> = ({
  config,
  onOpenStateChange,
}) => {
  const [isLit, setIsLit] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const rawParagraphs = config.letter?.paragraphs || [];
  const validParagraphs = rawParagraphs.filter((p) => p && p.trim().length > 0);

  const handleTapCake = () => {
    if (isOpen || isAnimating) return;
    setIsAnimating(true);
    // 1. Flicker and brighten candles, dim lights
    setTimeout(() => {
      setIsOpen(true);
      if (onOpenStateChange) onOpenStateChange(true);
      setIsAnimating(false);
    }, 1000);
  };

  const handleReset = () => {
    if (!isOpen || isAnimating) return;
    setIsAnimating(true);
    setIsOpen(false);
    if (onOpenStateChange) onOpenStateChange(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 1. Closed State: Gorgeous 3-Tier Cake */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="cake-closed"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30, transition: { duration: 0.5 } }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center py-6 w-full max-w-xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-center mb-8 space-y-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-200/20 text-pink-200 text-xs font-serif italic mb-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
                <span>Happy Birthday, {config.recipientNickname || 'my love'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-tight">
                Make a wish before you open your surprise
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light">
                Tap the celebration cake to light the candles and reveal your letter
              </p>
            </motion.div>

            {/* Interactive Cake Graphic Container */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Tap the birthday cake to make a wish and reveal your letter"
              onClick={handleTapCake}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTapCake();
                }
              }}
              className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70 rounded-3xl p-6 transition-transform duration-500 hover:scale-105 active:scale-95"
            >
              {/* Warm Pink/Gold Ambient Glow */}
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-pink-500/20 via-amber-200/20 to-transparent blur-3xl group-hover:opacity-100 opacity-75 transition-opacity pointer-events-none" />

              <div className="relative w-64 sm:w-72 h-72 sm:h-80 flex flex-col items-center justify-end">
                {/* Candles & Flames */}
                <div className="flex items-center gap-6 mb-1 z-20">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="relative flex flex-col items-center">
                      {/* Flame */}
                      {isLit && (
                        <motion.div
                          animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.85, 1, 0.85],
                          }}
                          transition={{
                            duration: 0.8 + idx * 0.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute -top-4 w-3.5 h-5 rounded-full bg-gradient-to-t from-amber-400 via-yellow-200 to-white shadow-[0_0_12px_rgba(255,200,100,0.9)]"
                        />
                      )}
                      {/* Wick */}
                      <div className="w-0.5 h-3 bg-zinc-700" />
                      {/* Candle Body */}
                      <div className="w-3.5 h-10 rounded-sm bg-gradient-to-r from-pink-200 via-pink-100 to-pink-300 shadow-md border-t border-pink-400" />
                    </div>
                  ))}
                </div>

                {/* Tier 3 (Top Tier) */}
                <div className="relative w-36 h-14 rounded-t-xl bg-gradient-to-r from-pink-200 via-pink-100 to-pink-300 border-t-2 border-white/60 shadow-lg flex items-center justify-center overflow-hidden z-10">
                  {/* Frosting drips */}
                  <div className="absolute top-0 inset-x-0 h-3 bg-white rounded-b-lg shadow-sm" />
                  <span className="text-[10px] font-serif italic text-pink-900 tracking-wider font-semibold z-10">
                    {config.recipientNickname}
                  </span>
                </div>

                {/* Tier 2 (Middle Tier) */}
                <div className="relative w-48 h-16 rounded-t-xl bg-gradient-to-r from-pink-300 via-pink-200 to-pink-400 border-t-2 border-white/50 shadow-xl flex items-center justify-center overflow-hidden z-10">
                  <div className="absolute top-0 inset-x-0 h-3.5 bg-white rounded-b-lg shadow-sm" />
                  <div className="absolute inset-x-0 bottom-2 flex justify-around opacity-40">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-white" />
                    ))}
                  </div>
                </div>

                {/* Tier 1 (Bottom Tier) */}
                <div className="relative w-64 h-20 rounded-t-2xl bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 border-t-2 border-white/50 shadow-2xl flex items-center justify-center overflow-hidden z-10">
                  <div className="absolute top-0 inset-x-0 h-4 bg-white rounded-b-xl shadow-md" />
                  {/* Golden ribbon band */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-amber-200/80 shadow-inner flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-amber-300 shadow-md border border-amber-100" />
                  </div>
                </div>

                {/* Cake Stand Base */}
                <div className="w-72 h-3 rounded-full bg-zinc-700/80 shadow-2xl border-t border-zinc-600" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center gap-2 text-xs font-sans text-pink-300/90 group-hover:text-pink-200 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
              <span className="tracking-wide">Tap the cake to make your wish</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Revealed State: Letter & Birthday Wish */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cake-revealed"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto py-6 space-y-8"
          >
            {/* Top Action Bar */}
            <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-pink-400" />
                <span className="font-serif italic text-pink-200 text-sm">
                  Wish Granted · For {config.recipientNickname}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 hover:border-pink-300/50 text-zinc-300 hover:text-white transition-all text-xs"
                title="Put candles back"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
                <span className="font-sans text-[11px]">View Cake Again</span>
              </button>
            </div>

            {/* Letter Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full rounded-2xl bg-[#140f13]/95 border border-pink-300/25 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-7 sm:p-12 md:p-14 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-2 sm:inset-3 rounded-xl border border-pink-100/10 pointer-events-none" />

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
                    <div className="text-base sm:text-lg italic text-pink-200/90 whitespace-pre-line leading-relaxed">
                      {config.letter.signOff}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Final Wish */}
            {config.finalReveal && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.8 }}
                className="pt-6 border-t border-zinc-800/80 space-y-4 text-center"
              >
                <span className="text-xs uppercase tracking-[0.25em] text-pink-300/80 font-sans block">
                  Birthday Wish
                </span>
                {config.finalReveal.birthdayWish && (
                  <p className="text-xl sm:text-2xl font-serif text-ivory leading-relaxed font-light max-w-xl mx-auto text-balance">
                    "{config.finalReveal.birthdayWish}"
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
