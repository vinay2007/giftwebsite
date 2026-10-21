import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit3, Check, Sparkles } from 'lucide-react';
import { GiftConfig } from '../config/giftConfig';
import { ThemeRevealRenderer } from './themes/ThemeRevealRenderer';

interface Chapter05EnvelopeProps {
  config: GiftConfig;
  onUpdateRevealMessage?: (message: string, wish: string) => void;
}

export const Chapter05Envelope: React.FC<Chapter05EnvelopeProps> = ({
  config,
  onUpdateRevealMessage,
}) => {
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [birthdayWish, setBirthdayWish] = useState(config.finalReveal.birthdayWish);
  const [closingProse, setClosingProse] = useState(config.finalReveal.closingProse);

  const handleSaveMessage = () => {
    if (onUpdateRevealMessage) {
      onUpdateRevealMessage(closingProse, birthdayWish);
    }
    setIsEditingMessage(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 sm:px-8 select-none overflow-hidden">
      {/* Soft celestial background ambiance */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          initial={{ scale: 1.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 3.5, ease: 'easeOut' }}
          className="w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full border border-amber-300/10 pointer-events-none"
        />
        <div className="w-96 h-96 rounded-full bg-amber-500/10 blur-[110px] pointer-events-none" />
      </div>

      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 max-w-xl mx-auto text-center pb-4"
      >
        <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
          Chapter 05
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ivory font-normal">
          The sealed letter
        </h2>
        <p className="text-xs text-zinc-400 font-sans font-light mt-1">
          There's one last thing for you.
        </p>
      </motion.div>

      {/* Editor Controls if in customizable preview mode */}
      {onUpdateRevealMessage && (
        <div className="relative z-20 max-w-2xl w-full flex justify-end pb-3 text-xs">
          <button
            onClick={() => setIsEditingMessage(!isEditingMessage)}
            className="flex items-center gap-1.5 text-xs text-amber-200/80 hover:text-amber-200 transition-colors py-1.5 px-3 rounded-full bg-zinc-900/80 border border-zinc-700/80"
          >
            {isEditingMessage ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditingMessage ? 'Done' : 'Edit Final Wish'}</span>
          </button>
        </div>
      )}

      {/* Message edit fields */}
      {isEditingMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 max-w-xl w-full space-y-3 p-5 rounded-2xl bg-zinc-950/90 border border-zinc-700 shadow-2xl mb-6 backdrop-blur-xl"
        >
          <div>
            <label className="block text-xs font-sans text-zinc-400 mb-1">
              Final Birthday Wish:
            </label>
            <textarea
              value={birthdayWish}
              onChange={(e) => setBirthdayWish(e.target.value)}
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-ivory font-serif focus:outline-none focus:border-amber-200"
            />
          </div>

          <div>
            <label className="block text-xs font-sans text-zinc-400 mb-1">
              Closing Line:
            </label>
            <input
              type="text"
              value={closingProse}
              onChange={(e) => setClosingProse(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-ivory font-serif focus:outline-none focus:border-amber-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsEditingMessage(false)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMessage}
              className="px-4 py-1.5 text-xs font-medium bg-amber-200 text-zinc-950 rounded-lg hover:bg-amber-100"
            >
              Save Wish
            </button>
          </div>
        </motion.div>
      )}

      {/* Theme Reveal Object Renderer */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        <ThemeRevealRenderer
          config={{
            ...config,
            finalReveal: {
              ...config.finalReveal,
              birthdayWish,
              closingProse,
            },
          }}
        />
      </div>
    </div>
  );
};
