import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, BookOpen, Heart, Music, Mic, Play, Pause, ChevronRight, ChevronLeft, Paperclip, Stamp } from 'lucide-react';
import { GiftData } from '../../config/giftConfig';
import { ambientSynthesizer } from '../../utils/audioSynthesizer';

interface OurScrapbookThemeProps {
  gift: GiftData;
  onBackToEditor?: () => void;
  isPreviewMode?: boolean;
}

export const OurScrapbookTheme: React.FC<OurScrapbookThemeProps> = ({
  gift,
  onBackToEditor,
  isPreviewMode = false,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Audio states
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const songAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  const pages = [
    { id: 'cover', title: 'Album Cover' },
    { id: 'memories', title: 'Taped Polaroids' },
    { id: 'letter', title: 'Folded Letter' },
    { id: 'audio', title: 'Mixtape & Notes' },
    { id: 'reveal', title: 'Final Page' },
  ];

  const toggleSong = () => {
    if (!songAudioRef.current) return;
    if (isPlayingSong) {
      songAudioRef.current.pause();
      setIsPlayingSong(false);
    } else {
      songAudioRef.current.play().then(() => setIsPlayingSong(true)).catch(() => {
        ambientSynthesizer.play();
      });
    }
  };

  const toggleVoice = () => {
    if (!voiceAudioRef.current) return;
    if (isPlayingVoice) {
      voiceAudioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      voiceAudioRef.current.play().then(() => setIsPlayingVoice(true)).catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      songAudioRef.current?.pause();
      voiceAudioRef.current?.pause();
      ambientSynthesizer.stop();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#f4eee1] text-[#3c3127] font-serif selection:bg-[#d4a373]/30 overflow-x-hidden">
      {/* Hidden audio tags */}
      {gift.audio.songSrc && (
        <audio ref={songAudioRef} src={gift.audio.songSrc} onEnded={() => setIsPlayingSong(false)} />
      )}
      {gift.audio.voiceSrc && (
        <audio ref={voiceAudioRef} src={gift.audio.voiceSrc} onEnded={() => setIsPlayingVoice(false)} />
      )}

      {/* DECORATIVE LAYER 1: Tactile Scrapbook Stickers & Postmarks scattered along edges */}
      {/* Top Left Postage Stamp */}
      <div className="fixed top-20 left-4 sm:left-8 pointer-events-none z-10 hidden sm:block opacity-75 rotate-[-8deg]">
        <div className="w-16 h-20 bg-[#fffdfa] border-2 border-dashed border-[#a68a72] p-1.5 shadow-md flex flex-col justify-between items-center text-center">
          <span className="text-[8px] font-mono text-[#a68a72] uppercase font-bold tracking-widest">AIR MAIL</span>
          <Heart className="w-6 h-6 text-[#bc6c25] fill-[#bc6c25]/30" />
          <span className="text-[9px] font-mono font-bold text-[#3c3127]">FOREVER</span>
        </div>
      </div>

      {/* Top Right "ADMIT ONE" Ticket Stub */}
      <div className="fixed top-20 right-4 sm:right-8 pointer-events-none z-10 hidden sm:block opacity-80 rotate-[12deg]">
        <div className="w-24 h-12 bg-[#e9d8a6] border-2 border-[#bb9457] rounded-sm p-1.5 shadow-md flex flex-col justify-center items-center text-center">
          <span className="text-[8px] font-mono tracking-widest font-black text-[#584428]">★ ADMIT ONE ★</span>
          <span className="text-[10px] font-mono font-bold text-[#8a5a2b]">OUR MEMORIES</span>
        </div>
      </div>

      {/* Bottom Left Pressed Leaf & Paperclip */}
      <div className="fixed bottom-8 left-6 pointer-events-none z-10 hidden md:block opacity-80 rotate-[6deg]">
        <div className="flex items-center gap-1 bg-[#fffaf0] px-3 py-1.5 rounded-sm shadow-md border border-[#e2d5c3]">
          <Paperclip className="w-4 h-4 text-[#8a7b6b]" />
          <span className="text-xs font-mono text-[#735e4d]">keepsake #01</span>
        </div>
      </div>

      {/* Bottom Right Paper Heart Doodle */}
      <div className="fixed bottom-8 right-6 pointer-events-none z-10 hidden md:block opacity-80 rotate-[-10deg]">
        <div className="w-16 h-16 rounded-full bg-[#f4a261]/20 border border-dashed border-[#e76f51] flex items-center justify-center text-center shadow-sm">
          <span className="text-xs font-serif italic text-[#e76f51] font-bold">xoxo</span>
        </div>
      </div>

      {/* Preview top bar */}
      {isPreviewMode && onBackToEditor && (
        <div className="fixed top-4 left-4 z-50 font-sans">
          <button
            onClick={onBackToEditor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#faf6ee] hover:bg-[#eae2d3] border-2 border-[#b08968] text-[#3c3127] text-xs font-bold shadow-md transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px]">Back to Editor</span>
          </button>
        </div>
      )}

      {/* Scrapbook Header with Album Spine feel */}
      <header className="sticky top-0 z-40 bg-[#f4eee1]/95 backdrop-blur-md border-b-2 border-[#cbbca9] px-6 sm:px-12 py-3.5 flex items-center justify-between font-sans">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#9c6644]" />
          <span className="font-serif italic font-bold text-lg text-[#3c3127] tracking-wide">
            {gift.siteTitle || gift.title}
          </span>
        </div>

        {/* Tactile Page-Turn Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs">
          {pages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentPage(idx)}
              className={`px-3.5 py-1.5 rounded-t-lg transition-all font-serif font-bold text-xs border-b-2 ${
                currentPage === idx
                  ? 'bg-[#faf6ee] text-[#7f4f24] border-[#7f4f24] shadow-sm -translate-y-0.5'
                  : 'bg-[#e6dccb] text-[#584738] border-transparent hover:bg-[#eee6d7]'
              }`}
            >
              0{idx + 1}. {p.title}
            </button>
          ))}
        </nav>

        <span className="text-xs italic text-[#7f4f24] font-serif font-bold bg-[#7f4f24]/10 px-3 py-1 rounded-full border border-[#7f4f24]/20">
          ✂️ For {gift.recipientNickname || 'you'}
        </span>
      </header>

      {/* Mobile Page Tabs */}
      <div className="md:hidden flex overflow-x-auto gap-1.5 p-2 bg-[#e6dccb] border-b-2 border-[#cbbca9] scrollbar-none font-sans font-medium text-xs">
        {pages.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setCurrentPage(idx)}
            className={`px-3 py-1 rounded-md text-xs shrink-0 whitespace-nowrap ${
              currentPage === idx
                ? 'bg-[#faf6ee] text-[#7f4f24] font-bold shadow-xs'
                : 'bg-white/60 text-[#3c3127]'
            }`}
          >
            0{idx + 1}. {p.title}
          </button>
        ))}
      </div>

      {/* Scrapbook Album Main Viewport */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        <AnimatePresence mode="wait">
          {currentPage === 0 && (
            <motion.div
              key="cover"
              initial={{ opacity: 0, rotateY: -10 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 10 }}
              className="max-w-2xl mx-auto bg-[#faf6ee] border-8 border-[#b08968] shadow-2xl rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden my-4"
            >
              {/* Patterned Washi Tape on Top Center */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#dda15e]/70 rotate-[-1deg] shadow-sm border border-dashed border-[#b08968] flex items-center justify-center">
                <span className="text-[10px] font-mono tracking-widest text-[#584428] font-bold">♥ OUR MEMORY ALBUM ♥</span>
              </div>

              {/* Corner Photo Tabs */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#b08968]" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#b08968]" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#b08968]" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#b08968]" />

              <span className="text-xs uppercase tracking-[0.25em] text-[#9c6644] font-sans font-bold block pt-4">
                Handcrafted With Love
              </span>

              <h1 className="text-4xl sm:text-6xl font-serif text-[#3c3127] font-bold tracking-tight leading-tight text-balance">
                Our Scrapbook: Dedicated to <span className="italic text-[#9c6644] underline decoration-[#dda15e] decoration-wavy">{gift.recipientNickname}</span>
              </h1>

              <p className="text-base sm:text-lg text-[#584738] font-serif italic max-w-md mx-auto leading-relaxed">
                "{gift.opening.tagline}   every picture taped, every thought penned just for you."
              </p>

              <div className="pt-4">
                <button
                  onClick={() => setCurrentPage(1)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#9c6644] hover:bg-[#7f4f24] text-white font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-md hover:scale-105"
                >
                  <span>Turn the Page</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentPage === 1 && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#9c6644] font-sans font-bold">
                  Album Page Two
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3c3127]">
                  Taped Polaroid Keepsakes
                </h2>
                <p className="text-xs font-sans text-[#7f6955]">
                  Click any taped Polaroid to lift it off the page and see the caption!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
                {gift.photos.map((photo, index) => {
                  const rot = index === 0 ? -3 : index === 1 ? 2.5 : -2;
                  const tapePattern = index % 2 === 0 ? 'bg-[#dda15e]/75' : 'bg-[#e07a5f]/70';
                  return (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className="group cursor-pointer bg-white p-4 pb-8 rounded-sm shadow-xl border border-[#ded3c2] hover:rotate-0 transition-transform duration-300 relative"
                      style={{ transform: `rotate(${rot}deg)` }}
                    >
                      {/* Decorative Washi Tape across the top */}
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 ${tapePattern} shadow-xs border border-white/40 rotate-[1deg]`}>
                        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[length:6px_6px]" />
                      </div>

                      {/* Polaroid Photo Window */}
                      <div className="aspect-4/3 bg-[#ebe5da] overflow-hidden mb-4 border border-[#e5ded2] shadow-inner">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Handwritten caption below */}
                      <p className="font-serif italic text-sm text-[#3c3127] text-center font-bold px-1">
                        "{photo.caption}"
                      </p>
                      <span className="text-[10px] font-mono text-[#9c6644] text-center block mt-2">
                        📍 {photo.dateOrLocation || `Memory 0${index + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentPage === 2 && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto bg-[#fffdfa] border-2 border-[#d6c7b2] shadow-2xl rounded-2xl p-8 sm:p-14 space-y-6 relative"
            >
              {/* Paperclip holding a note at top right */}
              <div className="absolute -top-3 right-8 flex items-center gap-1.5 bg-[#fefae0] px-3 py-1 border border-[#cca574] rounded shadow-sm text-xs font-mono font-bold text-[#7f4f24]">
                <Paperclip className="w-4 h-4" />
                <span>from: {gift.senderNickname}</span>
              </div>

              <div className="text-xs font-mono text-[#a68a72] uppercase tracking-wider pb-2 border-b border-[#ebdcc8]">
                PAGE 03 · PERSONAL LETTER
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-[#3c3127] font-bold">
                {gift.letter.salutation}
              </h3>

              <div className="space-y-4 font-serif text-lg text-[#3c3127]/90 leading-relaxed font-normal">
                {gift.letter.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-6 border-t border-[#ebdcc8] text-right font-serif italic text-xl text-[#9c6644] font-bold">
                {gift.letter.signOff}
              </div>
            </motion.div>
          )}

          {currentPage === 3 && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <div className="text-center space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#9c6644] font-sans font-bold">
                  Album Page Four
                </span>
                <h2 className="text-3xl font-serif font-bold text-[#3c3127]">
                  Mixtape & Spoken Voice
                </h2>
                <p className="text-xs font-sans text-[#7f6955]">
                  Soundtrack and personal voice recording taped into the album.
                </p>
              </div>

              <div className="grid gap-4 pt-2">
                {gift.audio.songSrc && (
                  <div className="p-6 rounded-2xl bg-[#fffdfa] border-2 border-[#d6c7b2] shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleSong}
                        className="w-12 h-12 rounded-full bg-[#9c6644] text-white flex items-center justify-center shadow-md hover:bg-[#7f4f24]"
                      >
                        {isPlayingSong ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#3c3127]">{gift.audio.songTitle}</h4>
                        <span className="text-xs font-sans text-[#9c6644]">Our Cassette Track</span>
                      </div>
                    </div>
                  </div>
                )}

                {gift.audio.voiceSrc && (
                  <div className="p-6 rounded-2xl bg-[#fffdfa] border-2 border-[#d6c7b2] shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleVoice}
                        className="w-12 h-12 rounded-full bg-[#dda15e] text-[#3c3127] flex items-center justify-center shadow-md hover:bg-[#c68b49]"
                      >
                        {isPlayingVoice ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#3c3127]">{gift.audio.voiceTitle}</h4>
                        <span className="text-xs font-sans text-[#9c6644]">Spoken Audio Recording</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentPage === 4 && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto text-center bg-[#fffdfa] border-4 border-[#b08968] shadow-2xl rounded-3xl p-8 sm:p-14 space-y-6 relative"
            >
              <div className="w-16 h-16 rounded-full bg-[#dda15e]/30 border-2 border-[#9c6644] flex items-center justify-center text-2xl mx-auto shadow-inner">
                💌
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#3c3127]">
                {gift.finalReveal.title}
              </h2>
              <p className="text-xl font-serif italic text-[#3c3127] font-bold leading-relaxed">
                "{gift.finalReveal.birthdayWish}"
              </p>
              <p className="text-sm font-sans text-[#7f6955]">
                {gift.finalReveal.closingProse}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Album Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between font-sans text-xs font-bold">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e6dccb] text-[#3c3127] disabled:opacity-30 hover:bg-[#d8ccb8] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>
          <span className="text-[#9c6644] font-mono text-xs">
            PAGE {currentPage + 1} OF {pages.length}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
            disabled={currentPage === pages.length - 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#9c6644] text-white disabled:opacity-30 hover:bg-[#7f4f24] transition-colors shadow-sm"
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <div
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#faf6ee] p-6 rounded-2xl border-4 border-[#b08968] shadow-2xl max-w-lg w-full space-y-4 font-serif"
            >
              <div className="aspect-4/3 rounded overflow-hidden border border-[#b08968]/30 bg-black">
                <img
                  src={gift.photos[selectedPhotoIndex].src}
                  alt={gift.photos[selectedPhotoIndex].alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-serif italic text-lg text-center text-[#3c3127] font-bold">
                "{gift.photos[selectedPhotoIndex].caption}"
              </p>
              <div className="text-center pt-2 font-sans">
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="px-6 py-2 bg-[#9c6644] text-white rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Return to Scrapbook
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
