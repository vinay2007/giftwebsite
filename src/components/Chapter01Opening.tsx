import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { GiftConfig } from '../config/giftConfig';

interface Chapter01OpeningProps {
  config: GiftConfig;
  onEnter: () => void;
}

export const Chapter01Opening: React.FC<Chapter01OpeningProps> = ({ config, onEnter }) => {
  const [imageError, setImageError] = useState(false);
  const placeholderSrc = config.photos[0]?.src;

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center select-none">
      {/* Luminous floating celestial orb / abstract moon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-12 sm:mb-16 flex items-center justify-center"
      >
        {/* Deep ambient back-glow */}
        <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-amber-500/10 via-amber-200/15 to-transparent blur-3xl animate-pulse-glow" />

        {/* Luminous floating moon disc with mini placeholder image on top */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-2xl animate-float-1 border border-zinc-500/25 bg-gradient-to-br from-zinc-800 via-zinc-900 to-[#0c0c11] flex items-center justify-center group">
          {/* Subtle lunar crater texture using radial gradient */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_35%_35%,rgba(255,245,225,0.45)_0%,transparent_60%)]" />
          <div className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full bg-zinc-950/30 blur-sm" />
          <div className="absolute bottom-1/3 left-1/5 w-20 h-20 rounded-full bg-zinc-950/20 blur-md" />
          <div className="absolute inset-0 ring-1 ring-inset ring-amber-100/25 rounded-full" />
          
          {/* Subtle crescent rim light */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-transparent via-amber-200/20 to-amber-100/40 blur-[1px] pointer-events-none" />

          {/* Placeholder image on top of the circle (just a little smaller than the outer orb) */}
          <div className="relative z-10 w-[90%] h-[90%] rounded-full overflow-hidden border border-amber-200/50 shadow-2xl bg-zinc-950/80 backdrop-blur-sm group-hover:scale-[1.02] transition-all duration-700">
            {placeholderSrc && !imageError ? (
              <img
                src={placeholderSrc}
                alt="Mini memory"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-zinc-900/90 text-zinc-300">
                <Sparkles className="w-6 h-6 text-amber-200/80 mb-1.5 animate-pulse" />
                <span className="text-[11px] font-serif italic text-amber-100/90 tracking-wide">
                  Somewhere Between Us
                </span>
              </div>
            )}

            {/* Vignette & fine hairline ring */}
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/55 pointer-events-none" />
            <div className="absolute inset-0 ring-1 ring-inset ring-amber-100/30 rounded-full pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Elegant typographic intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl mx-auto space-y-4"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-sans block">
          {config.opening.tagline}
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-ivory leading-tight text-balance">
          Happy Birthday, <span className="italic text-amber-200/90 font-serif">{config.recipientNickname}</span>.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 font-sans font-light max-w-md mx-auto leading-relaxed pt-2">
          {config.opening.invitationPrompt}
        </p>
      </motion.div>

      {/* Minimal interactive invitation CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 sm:mt-12 flex flex-col items-center gap-3"
      >
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/60 hover:border-amber-200/40 text-ivory text-sm tracking-widest uppercase transition-all duration-300 shadow-lg shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/60"
        >
          <span className="font-sans font-medium text-xs sm:text-sm">
            {config.opening.enterButtonText}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300/80 group-hover:scale-125 transition-transform" />
        </button>

        <span className="text-[11px] text-zinc-500 font-sans tracking-wide">
          {config.opening.subtext}
        </span>
      </motion.div>
    </div>
  );
};
