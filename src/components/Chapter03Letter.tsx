import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit3, Check, Heart, Feather } from 'lucide-react';
import { GiftConfig } from '../config/giftConfig';

interface Chapter03LetterProps {
  config: GiftConfig;
  onUpdateLetter?: (paragraphs: string[], salutation?: string, signOff?: string) => void;
}

export const Chapter03Letter: React.FC<Chapter03LetterProps> = ({
  config,
  onUpdateLetter,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [salutationText, setSalutationText] = useState(config.letter.salutation);
  const [paragraphsText, setParagraphsText] = useState(config.letter.paragraphs.join('\n\n'));
  const [signOffText, setSignOffText] = useState(config.letter.signOff);

  const rawParagraphs = config.letter?.paragraphs || [];
  const validParagraphs = rawParagraphs.filter((p) => p && p.trim().length > 0);
  const hasLetterContent =
    Boolean(config.letter?.salutation?.trim()) ||
    validParagraphs.length > 0 ||
    Boolean(config.letter?.signOff?.trim());

  const handleSave = () => {
    if (onUpdateLetter) {
      const splitParas = paragraphsText
        .split('\n\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      onUpdateLetter(splitParas, salutationText, signOffText);
    }
    setIsEditing(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 sm:px-6 select-none">
      {/* Chapter header */}
      <div className="relative z-10 max-w-xl mx-auto text-center pb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
          Chapter 03
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ivory font-normal">
          A letter from {config.senderNickname || 'your man'}
        </h2>
        <p className="text-xs text-zinc-400 font-sans font-light mt-1">
          Words written only for your eyes.
        </p>
      </div>

      {/* Action bar for Editor controls */}
      {onUpdateLetter && (
        <div className="relative z-20 max-w-2xl w-full flex items-center justify-end pb-3 text-xs text-zinc-400">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-amber-200/80 hover:text-amber-200 hover:underline transition-colors focus-visible:outline-none"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit your letter</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-zinc-300 font-serif italic">Editing your personal letter:</span>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-200 text-zinc-950 font-medium rounded hover:bg-amber-100 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Experience View */}
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl w-full rounded-2xl bg-[#0c0c11]/85 border border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl p-8 sm:p-12"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-sans text-zinc-400 mb-1">
                Salutation (Greeting for {config.recipientNickname}):
              </label>
              <input
                type="text"
                value={salutationText}
                onChange={(e) => setSalutationText(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-3 py-2 text-ivory font-serif text-lg focus:outline-none focus:border-amber-200"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-zinc-400 mb-1">
                Letter Paragraphs (Separate each paragraph with an empty blank line):
              </label>
              <textarea
                value={paragraphsText}
                onChange={(e) => setParagraphsText(e.target.value)}
                rows={10}
                className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg p-3 text-ivory font-serif text-base leading-relaxed focus:outline-none focus:border-amber-200"
                placeholder={`Write your genuine words for ${config.recipientNickname} here...`}
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-zinc-400 mb-1">
                Sign-off (Your closing words & nickname):
              </label>
              <textarea
                value={signOffText}
                onChange={(e) => setSignOffText(e.target.value)}
                rows={2}
                className="w-full bg-zinc-900/90 border border-zinc-700 rounded-lg px-3 py-2 text-ivory font-serif text-base focus:outline-none focus:border-amber-200"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        /* Direct readable parchment letter sheet (no envelope here) */
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-2xl w-full rounded-2xl bg-[#0c0c11]/90 border border-amber-200/20 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-7 sm:p-12 md:p-14 overflow-hidden"
        >
          {/* Subtle corner luminescence */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Inner hairline border */}
          <div className="absolute inset-2 sm:inset-3 rounded-xl border border-amber-100/10 pointer-events-none" />

          {/* Letter Content */}
          <div className="relative z-10 space-y-6 sm:space-y-8 max-h-[68vh] overflow-y-auto pr-2 sm:pr-4 select-text custom-scrollbar">
            {hasLetterContent ? (
              <>
                {/* Salutation */}
                {config.letter?.salutation && (
                  <h3 className="text-2xl sm:text-3xl font-serif text-ivory font-normal tracking-wide text-balance leading-snug">
                    {config.letter.salutation}
                  </h3>
                )}

                {/* Paragraphs */}
                <div className="space-y-5 text-base sm:text-lg font-serif text-zinc-200/95 leading-relaxed sm:leading-loose tracking-wide font-light">
                  {validParagraphs.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className={`whitespace-pre-line ${
                        paragraph.startsWith('[') && paragraph.endsWith(']')
                          ? 'italic text-amber-200/80 bg-amber-950/20 p-4 rounded-xl border border-amber-500/20'
                          : ''
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Sender Sign-off */}
                {config.letter?.signOff && (
                  <div className="pt-6 sm:pt-8 text-right font-serif">
                    <div className="text-base sm:text-lg italic text-amber-100/90 whitespace-pre-line leading-relaxed">
                      {config.letter.signOff}
                    </div>
                  </div>
                )}
              </>
            ) : (
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
      )}
    </div>
  );
};
