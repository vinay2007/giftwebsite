import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Compass, Heart, Music, Image as ImageIcon, BookOpen, Clock, Trash2, Copy, Plus } from 'lucide-react';
import { GiftData } from '../config/giftConfig';

interface LandingPageProps {
  onStartCreate: () => void;
  onExploreDemo: (themeStyle?: 'midnight' | 'wonderland' | 'garden' | 'scrapbook') => void;
  savedDrafts: GiftData[];
  onOpenDraft: (draft: GiftData) => void;
  onDuplicateDraft: (id: string) => void;
  onDeleteDraft: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCreate,
  onExploreDemo,
  savedDrafts,
  onOpenDraft,
  onDuplicateDraft,
  onDeleteDraft,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between select-none text-zinc-100">
      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-6 border-b border-zinc-800/40 bg-zinc-950/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-lg sm:text-xl text-ivory tracking-wide">
            Somewhere Between Us
          </span>
          <span className="text-zinc-600 hidden sm:inline">·</span>
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-sans hidden sm:inline">
            Digital Gift Atelier
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onExploreDemo()}
            className="text-xs font-sans text-zinc-400 hover:text-zinc-200 py-1.5 px-3 transition-colors"
          >
            Explore Demo
          </button>
          <button
            onClick={onStartCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-amber-200/40 hover:border-amber-200 text-ivory text-xs uppercase tracking-widest transition-all duration-300"
          >
            <span>Create Gift</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24 text-center max-w-4xl mx-auto">
        {/* Luminous Floating Orb Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-10 flex items-center justify-center cursor-pointer group"
          onClick={() => onExploreDemo()}
          title="Click to explore the sample gift experience"
        >
          <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-amber-500/10 via-amber-200/15 to-transparent blur-3xl animate-pulse-glow" />
          
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-2xl animate-float-1 border border-zinc-600/30 bg-gradient-to-br from-zinc-800 via-zinc-900 to-[#0a0a0f] flex items-center justify-center">
            {/* Crater & moon disc */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_35%_35%,rgba(255,245,225,0.45)_0%,transparent_60%)]" />
            <div className="absolute top-1/4 right-1/4 w-12 h-12 rounded-full bg-zinc-950/30 blur-sm" />
            <div className="absolute inset-0 ring-1 ring-inset ring-amber-100/25 rounded-full" />
            
            {/* Embedded delicate sample photo frame */}
            <div className="relative z-10 w-[88%] h-[88%] rounded-full overflow-hidden border border-amber-200/50 shadow-inner bg-zinc-950/80 group-hover:scale-105 transition-transform duration-700">
              {!imageError ? (
                <img
                  src="/media/memory-01.jpg"
                  alt="Somewhere Between Us"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-zinc-900/90 text-zinc-300">
                  <Sparkles className="w-6 h-6 text-amber-200/80 mb-1 animate-pulse" />
                  <span className="text-[11px] font-serif italic text-amber-100/90">
                    Somewhere Between Us
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-radial from-transparent to-black/60 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Cinematic Headline & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-sans block">
            A quiet sanctuary for someone you love
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-ivory leading-tight text-balance">
            Create an immersive, cinematic world for someone special.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 font-sans font-light max-w-2xl mx-auto leading-relaxed pt-1">
            Build a private birthday or anniversary gift website suspended in quiet celestial light — filled with your personal photographs, handwritten letter, music, and voice recording.
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={onStartCreate}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-amber-200 text-zinc-950 font-sans text-xs sm:text-sm font-medium tracking-widest uppercase hover:bg-amber-100 transition-all duration-300 shadow-xl shadow-amber-950/20"
          >
            <span>Create your gift</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onExploreDemo('midnight')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-500 text-zinc-300 hover:text-ivory text-xs sm:text-sm font-sans tracking-widest uppercase transition-all duration-300"
          >
            <Compass className="w-4 h-4 text-zinc-400" />
            <span>Explore sample experience</span>
          </button>
        </motion.div>

        {/* Four Independent Themed Experiences Showcase */}
        <section className="mt-16 w-full text-left space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-200/90 font-sans font-bold">
              Four Independent World Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-ivory font-normal">
              Distinct Art Direction & Celebration Atmosphere
            </h2>
            <p className="text-xs text-zinc-400 font-sans max-w-md mx-auto">
              Every theme features its own custom hero composition, animated decorations, layout, and interaction patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {/* Theme 1: Midnight Romance */}
            <div
              onClick={() => onExploreDemo('midnight')}
              className="group cursor-pointer p-5 rounded-2xl bg-[#09090e] border border-amber-200/30 hover:border-amber-200 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-xl">🌙</span>
                  <span className="text-[10px] font-sans font-semibold tracking-wider text-amber-200 uppercase bg-amber-200/10 px-2 py-0.5 rounded-full">
                    Midnight Fantasy
                  </span>
                </div>
                <h3 className="font-serif italic text-lg text-ivory group-hover:text-amber-200 transition-colors">
                  Midnight Romance
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Near-black celestial canvas, prominent glowing moon, hanging fairy lights, falling rose petals, and wax-sealed envelope.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-zinc-800 text-[11px] text-amber-200/90 font-medium flex items-center justify-between">
                <span>Preview Experience</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Theme 2: Birthday Wonderland */}
            <div
              onClick={() => onExploreDemo('wonderland')}
              className="group cursor-pointer p-5 rounded-2xl bg-[#fffcf2] text-[#2c221e] border-3 border-[#2c221e] shadow-[4px_4px_0px_#2c221e] hover:shadow-[2px_2px_0px_#2c221e] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-xl">🎂</span>
                  <span className="text-[10px] font-sans font-bold tracking-wider text-[#ff5964] uppercase bg-[#ff5964]/10 px-2 py-0.5 rounded-full">
                    Birthday Party
                  </span>
                </div>
                <h3 className="font-serif font-black text-lg text-[#2c221e] group-hover:text-[#ff5964] transition-colors">
                  Birthday Wonderland
                </h3>
                <p className="text-xs text-[#2c221e]/80 font-sans leading-relaxed font-medium">
                  Warm-cream festive world, bobbing colorful balloons, party bunting garland, interactive 3-tier cake, and confetti burst.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-[#2c221e]/15 text-[11px] text-[#ff5964] font-bold flex items-center justify-between">
                <span>Preview Experience</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Theme 3: Secret Garden */}
            <div
              onClick={() => onExploreDemo('garden')}
              className="group cursor-pointer p-5 rounded-2xl bg-[#f2f5f0] text-[#243024] border-2 border-[#4a6b4a]/40 hover:border-[#4a6b4a] shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-xl">🌿</span>
                  <span className="text-[10px] font-sans font-bold tracking-wider text-[#4a6b4a] uppercase bg-[#4a6b4a]/15 px-2 py-0.5 rounded-full">
                    Enchanted Arbor
                  </span>
                </div>
                <h3 className="font-serif italic text-lg text-[#243024] font-bold group-hover:text-[#4a6b4a] transition-colors">
                  Secret Garden
                </h3>
                <p className="text-xs text-[#243024]/80 font-sans leading-relaxed">
                  Solid sage & cream, flowering ivy arches, fluttering butterflies, hanging lanterns, winding path, and petal scattering letter.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-[#4a6b4a]/20 text-[11px] text-[#4a6b4a] font-bold flex items-center justify-between">
                <span>Preview Experience</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Theme 4: Our Scrapbook */}
            <div
              onClick={() => onExploreDemo('scrapbook')}
              className="group cursor-pointer p-5 rounded-2xl bg-[#faf6ee] text-[#3c3127] border-3 border-[#b08968] shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-xl">📖</span>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#9c6644] uppercase bg-[#9c6644]/15 px-2 py-0.5 rounded-full">
                    Handmade Album
                  </span>
                </div>
                <h3 className="font-serif italic text-lg text-[#3c3127] font-bold group-hover:text-[#9c6644] transition-colors">
                  Our Scrapbook
                </h3>
                <p className="text-xs text-[#584738] font-sans leading-relaxed">
                  Crafted album with tactile washi tape, airmail stamps, paperclips, taped Polaroids at playful angles, and handwritten doodles.
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-[#b08968]/20 text-[11px] text-[#9c6644] font-bold flex items-center justify-between">
                <span>Preview Experience</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Process Explanation */}
        <div className="mt-20 sm:mt-24 w-full grid grid-cols-1 sm:grid-cols-3 gap-8 text-left pt-12 border-t border-zinc-800/60">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-amber-200/90 text-sm">01.</span>
              <span className="text-xs uppercase tracking-wider text-zinc-300 font-sans font-medium">
                Personalize
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Choose the occasion, write your intimate letter, upload personal photographs, and choose your song and voice note.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-amber-200/90 text-sm">02.</span>
              <span className="text-xs uppercase tracking-wider text-zinc-300 font-sans font-medium">
                Preview & Polish
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Step directly into the full-screen cinematic world. Experience chapter transitions, inspect photos, and test audio as your recipient will.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-amber-200/90 text-sm">03.</span>
              <span className="text-xs uppercase tracking-wider text-zinc-300 font-sans font-medium">
                Save & Share
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Your work saves automatically in your browser with zero registration. Export the gift package or deploy it to surprise them.
            </p>
          </div>
        </div>

        {/* Saved Drafts in this browser (if any exist) */}
        {savedDrafts.length > 0 && (
          <section className="mt-16 w-full text-left p-6 sm:p-8 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-200/80" />
                <h2 className="text-sm font-serif italic text-ivory">
                  Your Saved Drafts in this Browser ({savedDrafts.length})
                </h2>
              </div>
              <span className="text-[11px] text-zinc-400 font-sans">
                Saved locally without an account
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {savedDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-serif text-ivory">{draft.title}</h3>
                      <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                        For <span className="text-amber-200/90">{draft.recipientNickname || 'Recipient'}</span> · {draft.occasion}
                      </p>
                    </div>
                    <span className="text-[10px] tabular-nums text-zinc-400 font-sans">
                      {draft.photos.length} photos
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50 text-xs">
                    <button
                      onClick={() => onOpenDraft(draft)}
                      className="text-amber-200 hover:text-amber-100 font-sans text-xs font-medium flex items-center gap-1"
                    >
                      <span>Resume editing</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDuplicateDraft(draft.id)}
                        className="text-zinc-500 hover:text-zinc-300 p-1 rounded"
                        title="Duplicate draft"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDraft(draft.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 rounded"
                        title="Delete draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Clean, quiet footer */}
      <footer className="relative z-20 px-6 sm:px-12 py-8 border-t border-zinc-800/50 text-xs text-zinc-400 font-sans flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>Somewhere Between Us · Digital Gift Atelier</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-zinc-300 cursor-default">About</span>
          <span className="hover:text-zinc-300 cursor-default">Privacy (Local Browser Storage)</span>
          <span className="hover:text-zinc-300 cursor-default">Architecture</span>
        </div>
      </footer>
    </div>
  );
};
