import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Copy, Check, RotateCcw, Eye, FileText, Music, Image as ImageIcon, Heart } from 'lucide-react';
import { GiftConfig } from '../config/giftConfig';

interface SenderCustomizerDrawerProps {
  config: GiftConfig;
  onUpdateConfig: (newConfig: GiftConfig) => void;
  onResetConfig: () => void;
  recipientViewOnly: boolean;
  onToggleRecipientViewOnly: () => void;
}

export const SenderCustomizerDrawer: React.FC<SenderCustomizerDrawerProps> = ({
  config,
  onUpdateConfig,
  onResetConfig,
  recipientViewOnly,
  onToggleRecipientViewOnly,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'nicknames' | 'letter' | 'photos' | 'audio' | 'reveal'>('guide');

  const handleCopyConfigTs = () => {
    const code = `import { GiftConfig } from './giftConfig';\n\nexport const initialGiftConfig: GiftConfig = ${JSON.stringify(
      config,
      null,
      2
    )};\n`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const updateField = (path: string, value: unknown) => {
    const newConfig = JSON.parse(JSON.stringify(config)) as GiftConfig;
    const parts = path.split('.');
    let curr: Record<string, unknown> = newConfig as unknown as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1; i++) {
      curr = curr[parts[i]] as Record<string, unknown>;
    }
    curr[parts[parts.length - 1]] = value;
    onUpdateConfig(newConfig);
  };

  return (
    <>
      {/* Top right discreet control bar */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={onToggleRecipientViewOnly}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-md ${
            recipientViewOnly
              ? 'bg-amber-200/20 text-amber-200 border-amber-200/40 shadow-sm'
              : 'bg-zinc-900/70 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
          }`}
          title="Toggle preview between Sender Customization mode and pure Girlfriend Experience"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="font-sans text-[11px] hidden sm:inline">
            {recipientViewOnly ? 'Recipient Preview' : 'Editing Mode'}
          </span>
        </button>

        {!recipientViewOnly && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-ivory border border-zinc-700/80 hover:border-amber-200/50 shadow-md backdrop-blur-md transition-all duration-200"
            aria-label="Open Gift Customizer & Asset Guide"
          >
            <Settings className="w-3.5 h-3.5 text-amber-200/80" />
            <span className="font-sans text-[11px]">Customize & Guide</span>
          </button>
        )}
      </div>

      {/* Slide-over Customization Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg h-full bg-[#0d0d12] border-l border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-200"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-ivory">Customize “Somewhere Between Us”</h3>
                  <p className="text-xs text-zinc-400 font-sans">
                    Settings & Asset Replacement Guide
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-zinc-800 px-3 bg-zinc-950/40 text-xs overflow-x-auto scrollbar-none">
                {[
                  { id: 'guide', label: 'Asset Guide', icon: FileText },
                  { id: 'nicknames', label: 'Names & Intro', icon: Heart },
                  { id: 'letter', label: 'Letter', icon: FileText },
                  { id: 'photos', label: 'Photos', icon: ImageIcon },
                  { id: 'audio', label: 'Audio', icon: Music },
                  { id: 'reveal', label: 'Final Wish', icon: Heart },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-1.5 py-3 px-3 border-b-2 font-sans font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? 'border-amber-200 text-ivory'
                          : 'border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs sm:text-sm">
                {activeTab === 'guide' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-zinc-300 space-y-2">
                      <p className="font-serif italic text-amber-200 text-base">
                        Where to place your files
                      </p>
                      <p className="text-xs leading-relaxed text-zinc-300">
                        All media assets are served directly from the <code className="text-amber-200">/public/media/</code> directory:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-400">
                        <li><strong className="text-zinc-200">Song:</strong> Place your audio at <code className="text-zinc-300">public/media/orumanam.mp3</code></li>
                        <li><strong className="text-zinc-200">Voice Note:</strong> Place your recorded audio at <code className="text-zinc-300">public/media/voice-note.mp3</code></li>
                        <li><strong className="text-zinc-200">Photos:</strong> Place your photos as <code className="text-zinc-300">public/media/memory-01.jpg</code>, <code className="text-zinc-300">memory-02.jpg</code>, <code className="text-zinc-300">memory-03.jpg</code></li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                      <p className="font-serif text-base text-zinc-200">How to edit code directly</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        All copy, paragraphs, nicknames, and ordering are centrally held in <code className="text-zinc-300">src/config/giftConfig.ts</code>. You can edit that single file anytime, or make changes right inside this drawer and click <strong>Copy Config Code</strong> below!
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'nicknames' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Recipient Nickname:
                      </label>
                      <input
                        type="text"
                        value={config.recipientNickname}
                        onChange={(e) => updateField('recipientNickname', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Sender Nickname:
                      </label>
                      <input
                        type="text"
                        value={config.senderNickname}
                        onChange={(e) => updateField('senderNickname', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Opening Tagline:
                      </label>
                      <input
                        type="text"
                        value={config.opening.tagline}
                        onChange={(e) => updateField('opening.tagline', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Opening Invitation:
                      </label>
                      <input
                        type="text"
                        value={config.opening.invitationPrompt}
                        onChange={(e) => updateField('opening.invitationPrompt', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-sans text-zinc-400 mb-1.5">
                        Website Experience Style (4 Distinct Themes):
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { id: 'midnight', label: '🌙 Midnight Romance' },
                          { id: 'wonderland', label: '🎂 Birthday Wonderland' },
                          { id: 'garden', label: '🌿 Secret Garden' },
                          { id: 'scrapbook', label: '📖 Our Scrapbook' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => updateField('theme.themeStyle', t.id)}
                            className={`p-2 rounded-lg border text-left font-medium transition-all ${
                              (config.theme?.themeStyle || 'midnight') === t.id
                                ? 'bg-amber-200/20 border-amber-200 text-ivory'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'letter' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Letter Salutation:
                      </label>
                      <input
                        type="text"
                        value={config.letter.salutation}
                        onChange={(e) => updateField('letter.salutation', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Letter Paragraphs (separate by blank line):
                      </label>
                      <textarea
                        value={config.letter.paragraphs.join('\n\n')}
                        onChange={(e) => {
                          const list = e.target.value
                            .split('\n\n')
                            .map((p) => p.trim())
                            .filter(Boolean);
                          updateField('letter.paragraphs', list);
                        }}
                        rows={8}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory font-serif text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Sign-off:
                      </label>
                      <textarea
                        value={config.letter.signOff}
                        onChange={(e) => updateField('letter.signOff', e.target.value)}
                        rows={2}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-400">
                      Currently displaying {config.photos.length} floating photos. You can edit their captions and image paths here:
                    </p>
                    {config.photos.map((photo, idx) => (
                      <div key={photo.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                        <div className="flex justify-between items-center text-xs text-zinc-400">
                          <span className="font-serif italic text-amber-200">Photo #{idx + 1}</span>
                          <span>{photo.id}</span>
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase">Image Path:</label>
                          <input
                            type="text"
                            value={photo.src}
                            onChange={(e) => {
                              const newPhotos = [...config.photos];
                              newPhotos[idx] = { ...photo, src: e.target.value };
                              updateField('photos', newPhotos);
                            }}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-ivory"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase">Caption:</label>
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => {
                              const newPhotos = [...config.photos];
                              newPhotos[idx] = { ...photo, caption: e.target.value };
                              updateField('photos', newPhotos);
                            }}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-xs text-ivory"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'audio' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Song Title:
                      </label>
                      <input
                        type="text"
                        value={config.audio.songTitle}
                        onChange={(e) => updateField('audio.songTitle', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Song Audio Path:
                      </label>
                      <input
                        type="text"
                        value={config.audio.songSrc}
                        onChange={(e) => updateField('audio.songSrc', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Voice Note Title:
                      </label>
                      <input
                        type="text"
                        value={config.audio.voiceTitle}
                        onChange={(e) => updateField('audio.voiceTitle', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Voice Note Audio Path:
                      </label>
                      <input
                        type="text"
                        value={config.audio.voiceSrc}
                        onChange={(e) => updateField('audio.voiceSrc', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'reveal' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Final Reveal Title:
                      </label>
                      <input
                        type="text"
                        value={config.finalReveal.title}
                        onChange={(e) => updateField('finalReveal.title', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Birthday Wish:
                      </label>
                      <textarea
                        value={config.finalReveal.birthdayWish}
                        onChange={(e) => updateField('finalReveal.birthdayWish', e.target.value)}
                        rows={3}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-zinc-400 mb-1">
                        Closing Prose:
                      </label>
                      <input
                        type="text"
                        value={config.finalReveal.closingProse}
                        onChange={(e) => updateField('finalReveal.closingProse', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-ivory text-sm focus:outline-none focus:border-amber-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-2">
                <button
                  onClick={onResetConfig}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 py-2 px-2.5"
                  title="Reset to default config"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyConfigTs}
                    className="flex items-center gap-1.5 text-xs py-2 px-3.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-amber-200" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Config!' : 'Copy Config Code'}</span>
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs py-2 px-4 rounded-lg bg-amber-200 hover:bg-amber-100 text-zinc-950 font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
