import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RotateCcw, Mail } from 'lucide-react';
import { GiftConfig } from '../config/giftConfig';

interface LoveLetterEnvelopeProps {
  config: GiftConfig;
  invitationTitle?: string;
  invitationSubtext?: string;
  showFinalRevealMessage?: boolean;
  onOpenStateChange?: (isOpen: boolean) => void;
  className?: string;
}

export const LoveLetterEnvelope: React.FC<LoveLetterEnvelopeProps> = ({
  config,
  invitationTitle = "There's one last thing for you",
  invitationSubtext = 'Tap the envelope to open',
  showFinalRevealMessage = true,
  onOpenStateChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if letter has any actual text
  const rawParagraphs = config.letter?.paragraphs || [];
  const validParagraphs = rawParagraphs.filter((p) => p && p.trim().length > 0);
  const hasLetterContent =
    Boolean(config.letter?.salutation?.trim()) ||
    validParagraphs.length > 0 ||
    Boolean(config.letter?.signOff?.trim());

  const handleOpenEnvelope = () => {
    if (isOpen || isAnimating) return;
    setIsAnimating(true);
    setIsOpen(true);
    if (onOpenStateChange) onOpenStateChange(true);

    // Allow full animation sequence to complete
    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  const handleCloseEnvelope = () => {
    if (!isOpen || isAnimating) return;
    setIsAnimating(true);
    setIsOpen(false);
    if (onOpenStateChange) onOpenStateChange(false);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  // Keyboard accessibility: open with Enter or Space when focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        handleOpenEnvelope();
      }
    }
  };

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* 1. Closed Envelope Stage */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="closed-envelope-stage"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20, transition: { duration: 0.5 } }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center py-6 w-full max-w-xl mx-auto"
          >
            {/* Gentle invitation prompt */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-center mb-8 space-y-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-200/20 text-amber-200/90 text-xs font-serif italic mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                <span>For {config.recipientNickname || 'you'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-tight">
                {invitationTitle}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light">
                {invitationSubtext}
              </p>
            </motion.div>

            {/* Realistic Illustrated Envelope Object */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Tap to open your love letter"
              onClick={handleOpenEnvelope}
              onKeyDown={handleKeyDown}
              className="group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-200/70 rounded-2xl p-1 transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99]"
            >
              {/* Warm Ambient Backglow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-500/15 via-amber-200/10 to-transparent blur-2xl group-hover:opacity-100 opacity-70 transition-opacity duration-700 pointer-events-none" />

              {/* Envelope Body Container */}
              <div className="relative w-[310px] sm:w-[380px] md:w-[420px] aspect-16/10 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-amber-200/20 bg-gradient-to-b from-[#221c17] via-[#1a1512] to-[#120f0d]">
                {/* Subtle paper grain & warm luster */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,215,160,0.15)_0%,transparent_75%)] pointer-events-none" />

                {/* Inner envelope pocket gradient depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Visible lower folds forming the envelope front */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 420 262"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="envelopeLeftFold" x1="0%" y1="100%" x2="50%" y2="50%">
                      <stop offset="0%" stopColor="#1a1512" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#2b231c" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="envelopeRightFold" x1="100%" y1="100%" x2="50%" y2="50%">
                      <stop offset="0%" stopColor="#181310" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#271f19" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="envelopeBottomFold" x1="50%" y1="100%" x2="50%" y2="50%">
                      <stop offset="0%" stopColor="#2f261f" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#1c1613" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Left triangle flap */}
                  <polygon points="0,0 0,262 210,140" fill="url(#envelopeLeftFold)" />
                  {/* Right triangle flap */}
                  <polygon points="420,0 420,262 210,140" fill="url(#envelopeRightFold)" />
                  {/* Bottom flap fold */}
                  <polygon points="0,262 420,262 210,135" fill="url(#envelopeBottomFold)" />

                  {/* Delicate gold hairline creases */}
                  <line x1="0" y1="262" x2="210" y2="135" stroke="rgba(240,207,152,0.15)" strokeWidth="1" />
                  <line x1="420" y1="262" x2="210" y2="135" stroke="rgba(240,207,152,0.15)" strokeWidth="1" />
                </svg>

                {/* Top Flap (pointing downward over the front when closed) */}
                <div
                  className="absolute top-0 inset-x-0 w-full h-[58%] origin-top transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    transform: isAnimating ? 'rotateX(180deg)' : 'rotateX(0deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <svg
                    className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
                    viewBox="0 0 420 152"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="topFlapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#3d3126" />
                        <stop offset="60%" stopColor="#2c221a" />
                        <stop offset="100%" stopColor="#231a14" />
                      </linearGradient>
                    </defs>
                    <polygon points="0,0 420,0 210,152" fill="url(#topFlapGrad)" />
                    {/* Golden rim highlight on flap edges */}
                    <line x1="0" y1="0" x2="210" y2="152" stroke="rgba(245,215,160,0.3)" strokeWidth="1.2" />
                    <line x1="420" y1="0" x2="210" y2="152" stroke="rgba(245,215,160,0.3)" strokeWidth="1.2" />
                  </svg>
                </div>

                {/* Wax Seal with Embossed Heart Crest */}
                <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {/* Wax Seal back-shadow */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#8a1c24] via-[#6d131a] to-[#40080d] p-0.5 shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-[#a82a33]/60 flex items-center justify-center">
                    {/* Irregular scalloped wax rim effect */}
                    <div className="absolute inset-0 rounded-full border border-amber-300/20 pointer-events-none" />

                    {/* Stamped inner impression circle */}
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#5c0e14] to-[#7f1921] shadow-inner flex items-center justify-center border border-[#942028]/70">
                      <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-200 fill-amber-200/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                    </div>

                    {/* Luminous seal pulse sparkle */}
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300/80 blur-[1px] animate-pulse" />
                  </div>
                </div>

                {/* Delicate front address calligraphy preview */}
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between pointer-events-none text-zinc-500 text-[10px] sm:text-xs">
                  <span className="font-serif italic text-amber-100/60 tracking-wider">
                    To my dearest {config.recipientNickname || 'one'}
                  </span>
                  <span className="font-sans uppercase tracking-[0.2em] text-zinc-600 text-[9px]">
                    Confidential
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle tap indicator pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex items-center gap-2 text-xs font-sans text-amber-200/80 group-hover:text-amber-100 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300/80 animate-ping" />
              <span className="tracking-wide">Touch or click to unseal</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Revealed Letter Experience */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="revealed-letter-stage"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto py-6 space-y-8"
          >
            {/* Top Action Bar: Re-fold / Read Again Control */}
            <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-200/80" />
                <span className="font-serif italic text-amber-100/90 text-sm">
                  Letter from {config.senderNickname || 'your man'}
                </span>
              </div>

              <button
                onClick={handleCloseEnvelope}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 hover:border-amber-200/50 text-zinc-300 hover:text-white transition-all text-xs"
                title="Fold letter back into envelope"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
                <span className="font-sans text-[11px]">Fold envelope</span>
              </button>
            </div>

            {/* Letter Sheet — Parchment Paper Styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full rounded-2xl bg-[#0c0c11]/90 border border-amber-200/25 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-7 sm:p-12 md:p-14 overflow-hidden"
            >
              {/* Warm corner ambient illumination */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Fine inner hairline border */}
              <div className="absolute inset-2 sm:inset-3 rounded-xl border border-amber-100/10 pointer-events-none" />

              {/* Scrollable Letter Content Container */}
              <div className="relative z-10 space-y-6 sm:space-y-8 max-h-[65vh] sm:max-h-[72vh] overflow-y-auto pr-2 sm:pr-4 select-text custom-scrollbar">
                {hasLetterContent ? (
                  <>
                    {/* Salutation / Greeting */}
                    {config.letter?.salutation && (
                      <motion.h4
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-wide text-balance leading-snug"
                      >
                        {config.letter.salutation}
                      </motion.h4>
                    )}

                    {/* Letter Paragraphs */}
                    <div className="space-y-5 text-base sm:text-lg font-serif text-zinc-200/95 leading-relaxed sm:leading-loose tracking-wide font-light">
                      {validParagraphs.map((paragraph, idx) => (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.9,
                            delay: 0.5 + idx * 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`whitespace-pre-line ${
                            paragraph.startsWith('[') && paragraph.endsWith(']')
                              ? 'italic text-amber-200/80 bg-amber-950/20 p-4 rounded-xl border border-amber-500/20'
                              : ''
                          }`}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>

                    {/* Sender Sign-off */}
                    {config.letter?.signOff && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 1.0,
                          delay: 0.6 + validParagraphs.length * 0.25,
                        }}
                        className="pt-6 sm:pt-8 text-right font-serif"
                      >
                        <div className="text-base sm:text-lg italic text-amber-100/90 whitespace-pre-line leading-relaxed">
                          {config.letter.signOff}
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  /* Graceful empty-state message if creator left letter empty */
                  <div className="text-center py-10 space-y-3">
                    <Heart className="w-6 h-6 text-amber-200/60 mx-auto" />
                    <p className="text-base sm:text-lg font-serif italic text-zinc-200">
                      Every unspoken feeling and gentle quiet we share lives right here.
                    </p>
                    <p className="text-xs text-zinc-400 font-sans">
                      Always with you, with all my love.
                    </p>
                    {config.senderNickname && (
                      <p className="text-sm font-serif italic text-amber-200/80 pt-2">
                        — {config.senderNickname}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* 3. Retained Final Birthday Message Section in Correct Sequence */}
            {showFinalRevealMessage && config.finalReveal && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="pt-6 border-t border-zinc-800/80 space-y-6 text-center"
              >
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-sans block">
                    A Final Birthday Wish for {config.recipientNickname}
                  </span>
                  <div className="w-8 h-px bg-amber-200/40 mx-auto my-3" />
                </div>

                {config.finalReveal.birthdayWish && (
                  <p className="text-xl sm:text-2xl font-serif text-ivory leading-relaxed font-light max-w-xl mx-auto text-balance">
                    "{config.finalReveal.birthdayWish}"
                  </p>
                )}

                {config.finalReveal.editableNotePlaceholder && (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs sm:text-sm font-serif italic text-amber-200/80 max-w-md mx-auto">
                    {config.finalReveal.editableNotePlaceholder}
                  </div>
                )}

                {config.finalReveal.closingProse && (
                  <p className="text-xs sm:text-sm text-zinc-400 font-serif italic leading-relaxed pt-2 max-w-lg mx-auto">
                    {config.finalReveal.closingProse}
                  </p>
                )}

                <div className="pt-2">
                  <span className="text-xs uppercase tracking-widest text-zinc-400 font-sans">
                    With all my love · {config.senderNickname}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
