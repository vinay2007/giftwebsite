import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, PartyPopper, Heart, Music, Mic, Play, Pause, Gift, Cake } from 'lucide-react';
import { GiftData } from '../../config/giftConfig';
import { ambientSynthesizer } from '../../utils/audioSynthesizer';

interface BirthdayWonderlandThemeProps {
  gift: GiftData;
  onBackToEditor?: () => void;
  isPreviewMode?: boolean;
}

export const BirthdayWonderlandTheme: React.FC<BirthdayWonderlandThemeProps> = ({
  gift,
  onBackToEditor,
  isPreviewMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'cake' | 'memories' | 'letter' | 'audio' | 'reveal'>('welcome');
  const [cakeLit, setCakeLit] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Audio states
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const songAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleLightCake = () => {
    setCakeLit(true);
    setConfettiActive(true);
    ambientSynthesizer.play();
    setTimeout(() => {
      setConfettiActive(false);
    }, 4000);
  };

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
    <div className="relative min-h-screen w-full bg-[#fffcf2] text-[#2c221e] font-sans selection:bg-[#ff5964]/20 overflow-x-hidden">
      {/* Hidden audio tags */}
      {gift.audio.songSrc && (
        <audio ref={songAudioRef} src={gift.audio.songSrc} onEnded={() => setIsPlayingSong(false)} />
      )}
      {gift.audio.voiceSrc && (
        <audio ref={voiceAudioRef} src={gift.audio.voiceSrc} onEnded={() => setIsPlayingVoice(false)} />
      )}

      {/* DECORATIVE LAYER 1: Hanging Party Bunting Garland (Pennants) across the top */}
      <div className="fixed top-0 inset-x-0 pointer-events-none z-30 overflow-hidden select-none">
        <svg className="w-full h-16 sm:h-20" viewBox="0 0 1200 90" preserveAspectRatio="none">
          {/* Swag string 1 */}
          <path d="M 0 10 Q 300 70 600 15 Q 900 70 1200 10" fill="none" stroke="#2c221e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          
          {/* Bunting Pennants */}
          {[
            { x: 30, y: 16, c: '#ff5964', rot: 4 },
            { x: 90, y: 26, c: '#ffd166', rot: -2 },
            { x: 150, y: 38, c: '#06d6a0', rot: 3 },
            { x: 210, y: 46, c: '#118ab2', rot: -4 },
            { x: 270, y: 48, c: '#ff5964', rot: 2 },
            { x: 330, y: 44, c: '#e01a4f', rot: -3 },
            { x: 390, y: 36, c: '#ffd166', rot: 5 },
            { x: 450, y: 26, c: '#06d6a0', rot: -2 },
            { x: 510, y: 19, c: '#ff5964', rot: 3 },
            { x: 570, y: 15, c: '#118ab2', rot: -1 },
            { x: 630, y: 19, c: '#ffd166', rot: 4 },
            { x: 690, y: 28, c: '#e01a4f', rot: -3 },
            { x: 750, y: 38, c: '#06d6a0', rot: 2 },
            { x: 810, y: 46, c: '#ff5964', rot: -4 },
            { x: 870, y: 48, c: '#ffd166', rot: 3 },
            { x: 930, y: 44, c: '#118ab2', rot: -2 },
            { x: 990, y: 34, c: '#ff5964', rot: 4 },
            { x: 1050, y: 24, c: '#06d6a0', rot: -3 },
            { x: 1110, y: 16, c: '#ffd166', rot: 2 },
            { x: 1170, y: 12, c: '#e01a4f', rot: -1 },
          ].map((flag, idx) => (
            <polygon
              key={idx}
              points={`${flag.x - 18},${flag.y} ${flag.x + 18},${flag.y} ${flag.x},${flag.y + 36}`}
              fill={flag.c}
              stroke="#2c221e"
              strokeWidth="1.2"
              className="animate-sway origin-top"
              style={{ animationDelay: `${(idx % 5) * 0.4}s` }}
            />
          ))}
        </svg>
      </div>

      {/* DECORATIVE LAYER 2: Bobbing Balloons Cluster Left & Right */}
      <div className="fixed top-12 left-4 sm:left-8 pointer-events-none z-10 hidden sm:block animate-balloon-1">
        <div className="relative">
          {/* Coral Balloon */}
          <div className="w-14 h-18 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr from-[#ff3838] to-[#ff7675] shadow-md border border-[#2c221e]/20 relative">
            <div className="absolute top-2 left-3 w-3 h-5 rounded-full bg-white/40 rotate-[-20deg]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-[#ff3838] border border-[#2c221e]/30" />
            <div className="absolute top-18 left-1/2 w-px h-28 bg-[#2c221e]/40 -translate-x-1/2 rotate-1" />
          </div>
          {/* Golden Yellow Balloon slightly offset */}
          <div className="w-12 h-16 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr from-[#fbc531] to-[#f5cd79] shadow-md border border-[#2c221e]/20 absolute -top-4 left-8">
            <div className="absolute top-2 left-2.5 w-2.5 h-4 rounded-full bg-white/45 rotate-[-20deg]" />
            <div className="absolute top-16 left-1/2 w-px h-24 bg-[#2c221e]/40 -translate-x-1/2 rotate-[-2deg]" />
          </div>
        </div>
      </div>

      <div className="fixed top-12 right-6 sm:right-10 pointer-events-none z-10 hidden sm:block animate-balloon-2">
        <div className="relative">
          {/* Turquoise Balloon */}
          <div className="w-14 h-18 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr from-[#00b894] to-[#55efc4] shadow-md border border-[#2c221e]/20 relative">
            <div className="absolute top-2 left-3 w-3 h-5 rounded-full bg-white/45 rotate-[-20deg]" />
            <div className="absolute top-18 left-1/2 w-px h-28 bg-[#2c221e]/40 -translate-x-1/2" />
          </div>
          {/* Pink Ribbon Balloon */}
          <div className="w-12 h-16 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr from-[#e84393] to-[#fd79a8] shadow-md border border-[#2c221e]/20 absolute -top-3 -left-6">
            <div className="absolute top-2 left-2 w-2.5 h-4 rounded-full bg-white/45 rotate-[-20deg]" />
            <div className="absolute top-16 left-1/2 w-px h-24 bg-[#2c221e]/40 -translate-x-1/2 rotate-2" />
          </div>
        </div>
      </div>

      {/* DECORATIVE LAYER 3: Stacked Gift Boxes with Bows in Bottom Corners */}
      <div className="fixed bottom-4 left-6 pointer-events-none z-10 hidden md:flex items-end gap-1.5 opacity-85">
        {/* Present 1 */}
        <div className="w-16 h-16 bg-[#ff5964] border-2 border-[#2c221e] rounded-lg shadow-[4px_4px_0px_#2c221e] relative">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3.5 bg-[#ffd166]" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3.5 bg-[#ffd166]" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-3 rounded-full border-2 border-[#2c221e] bg-[#ffd166]" />
        </div>
        {/* Present 2 */}
        <div className="w-12 h-12 bg-[#06d6a0] border-2 border-[#2c221e] rounded-lg shadow-[3px_3px_0px_#2c221e] relative">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2.5 bg-[#ff5964]" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2.5 bg-[#ff5964]" />
        </div>
      </div>

      <div className="fixed bottom-4 right-6 pointer-events-none z-10 hidden md:flex items-end gap-1.5 opacity-85">
        {/* Present 3 */}
        <div className="w-14 h-14 bg-[#ffd166] border-2 border-[#2c221e] rounded-lg shadow-[4px_4px_0px_#2c221e] relative">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 bg-[#e01a4f]" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-[#e01a4f]" />
        </div>
      </div>

      {/* CONFETTI BURST OVERLAY when cake is lit */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(40)].map((_, i) => {
            const colors = ['#ff5964', '#ffd166', '#06d6a0', '#118ab2', '#e01a4f'];
            const color = colors[i % colors.length];
            const left = `${Math.random() * 95}%`;
            const duration = `${1.5 + Math.random() * 2}s`;
            const size = 8 + (i % 8);
            return (
              <div
                key={i}
                className="absolute top-0 animate-[driftPetal_3s_ease-out_forwards]"
                style={{
                  left,
                  animationDuration: duration,
                }}
              >
                <div
                  style={{
                    width: size,
                    height: size * 1.5,
                    backgroundColor: color,
                    transform: `rotate(${i * 25}deg)`,
                  }}
                  className="rounded-xs shadow-sm"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Top Bar */}
      {isPreviewMode && onBackToEditor && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={onBackToEditor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white border-2 border-[#2c221e] text-[#2c221e] text-xs font-bold shadow-[3px_3px_0px_#2c221e] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Editor</span>
          </button>
        </div>
      )}

      {/* Playful Top Nav */}
      <header className="sticky top-0 z-40 bg-[#fffcf2]/95 backdrop-blur-md border-b-2 border-[#2c221e] px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#ff5964] border-2 border-[#2c221e] flex items-center justify-center text-white shadow-[2px_2px_0px_#2c221e]">
            <PartyPopper className="w-4 h-4" />
          </div>
          <span className="font-serif font-extrabold text-lg text-[#2c221e] tracking-tight">
            {gift.siteTitle || gift.title}
          </span>
        </div>

        {/* Illustrated Playful Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#f5eccb]/80 p-1 rounded-full border-2 border-[#2c221e] text-xs font-bold">
          {[
            { id: 'welcome', label: 'Party Central' },
            { id: 'cake', label: 'Birthday Cake 🎂' },
            { id: 'memories', label: 'Photo Bunting 📸' },
            { id: 'letter', label: 'Love Letter 💌' },
            { id: 'audio', label: 'Party Playlist 🎵' },
            { id: 'reveal', label: 'Grand Wish ✨' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-1.5 rounded-full transition-all text-xs ${
                activeTab === tab.id
                  ? 'bg-[#ff5964] text-white shadow-[2px_2px_0px_#2c221e] border border-[#2c221e]'
                  : 'text-[#2c221e]/80 hover:text-[#2c221e] hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="text-xs font-serif font-bold text-[#2c221e] bg-[#ffd166] border-2 border-[#2c221e] shadow-[2px_2px_0px_#2c221e] px-3 py-1 rounded-full">
            🎉 For {gift.recipientNickname || 'you'}
          </span>
        </div>
      </header>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex overflow-x-auto gap-2 p-2.5 bg-[#f5eccb] border-b-2 border-[#2c221e] scrollbar-none font-bold">
        {[
          { id: 'welcome', label: 'Party' },
          { id: 'cake', label: 'Cake 🎂' },
          { id: 'memories', label: 'Photos 📸' },
          { id: 'letter', label: 'Letter 💌' },
          { id: 'audio', label: 'Audio 🎵' },
          { id: 'reveal', label: 'Wish ✨' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 py-1 rounded-full text-xs shrink-0 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#ff5964] text-white border border-[#2c221e]'
                : 'bg-white/80 text-[#2c221e] border border-[#2c221e]/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Wonderland Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        <AnimatePresence mode="wait">
          {activeTab === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 py-8"
            >
              {/* Illustrated Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffd166] border-2 border-[#2c221e] text-[#2c221e] text-xs font-extrabold uppercase tracking-widest shadow-[3px_3px_0px_#2c221e]">
                <Sparkles className="w-4 h-4 text-[#ff5964]" />
                <span>The Greatest Birthday Ever</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-black text-[#2c221e] leading-tight text-balance">
                Happy Birthday, <span className="text-[#ff5964] inline-block -rotate-1 underline decoration-[#ffd166] decoration-4">{gift.recipientNickname}</span>!
              </h1>

              <p className="text-lg text-[#2c221e]/85 font-sans max-w-xl mx-auto leading-relaxed font-medium">
                {gift.opening.tagline}   welcome to your custom celebratory wonderland filled with cake, memories, and personal surprises!
              </p>

              <div className="pt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setActiveTab('cake')}
                  className="px-8 py-4 rounded-full bg-[#ff5964] hover:bg-[#e04853] text-white font-extrabold text-sm tracking-wider shadow-[4px_4px_0px_#2c221e] border-2 border-[#2c221e] transition-all hover:-translate-y-0.5"
                >
                  Light the Birthday Cake 🎂
                </button>
                <button
                  onClick={() => setActiveTab('memories')}
                  className="px-8 py-4 rounded-full bg-[#06d6a0] hover:bg-[#05b889] text-[#2c221e] border-2 border-[#2c221e] font-extrabold text-sm tracking-wider shadow-[4px_4px_0px_#2c221e] transition-all hover:-translate-y-0.5"
                >
                  Explore Photo Gallery 📸
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'cake' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto text-center space-y-8 py-4"
            >
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2c221e]">
                  Make a Wish & Tap the Candles!
                </h2>
                <p className="text-sm font-medium text-[#2c221e]/80">
                  Tap the three-tier cake to light up the candles and trigger the grand birthday confetti!
                </p>
              </div>

              {/* Elaborate Illustrated 3-Tier Cake */}
              <div
                onClick={handleLightCake}
                className="relative cursor-pointer group py-8 flex flex-col items-center select-none"
              >
                <div className="relative w-72 sm:w-80 h-92 bg-[#fdfaf2] rounded-3xl border-4 border-[#2c221e] shadow-[8px_8px_0px_#2c221e] flex flex-col items-center justify-end p-6 transition-transform group-hover:scale-102">
                  {/* Three Birthday Candles with Animated Flickering Flames */}
                  <div className="absolute top-3 flex gap-5">
                    {[1, 2, 3].map((c) => (
                      <div key={c} className="flex flex-col items-center">
                        {/* Flame */}
                        <div
                          className={`w-4 h-7 rounded-[50%_50%_20%_20%] transition-all duration-500 ${
                            cakeLit
                              ? 'bg-gradient-to-t from-amber-500 via-yellow-300 to-white animate-candle-flame shadow-[0_0_20px_#ffd166]'
                              : 'bg-zinc-400 opacity-60'
                          }`}
                        />
                        {/* Candle Stick with Festive Stripes */}
                        <div className="w-2.5 h-12 bg-white border-2 border-[#2c221e] rounded-xs bg-[repeating-linear-gradient(45deg,#ff5964,#ff5964_4px,#ffffff_4px,#ffffff_8px)]" />
                      </div>
                    ))}
                  </div>

                  {/* Tier 3 (Top Tier - Strawberry Cream) */}
                  <div className="w-40 h-16 bg-[#ff7675] border-3 border-[#2c221e] rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-3 bg-white/40 rounded-b-lg" />
                    <span>{cakeLit ? '✨ WISH GRANTED ✨' : 'TAP TO LIGHT'}</span>
                  </div>

                  {/* Tier 2 (Middle Tier - Lemon Chiffon with Cherries) */}
                  <div className="w-54 h-18 bg-[#ffd166] border-3 border-[#2c221e] rounded-2xl flex items-center justify-center font-black text-xs text-[#856404] shadow-inner mt-1.5 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-3.5 bg-white/50 rounded-b-xl" />
                    <span className="tracking-widest">HAPPY BIRTHDAY</span>
                  </div>

                  {/* Tier 1 (Bottom Tier - Mint Turquoise Base) */}
                  <div className="w-68 h-22 bg-[#06d6a0] border-3 border-[#2c221e] rounded-3xl flex items-center justify-center font-black text-base text-[#047558] shadow-inner mt-1.5 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-4 bg-white/40 rounded-b-2xl" />
                    <span className="tracking-wider">{gift.recipientNickname.toUpperCase()}</span>
                  </div>

                  {/* Cake Plate Stand */}
                  <div className="w-76 h-3 bg-[#2c221e] rounded-full mt-2" />
                </div>
              </div>

              {cakeLit && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-[#ffd166]/30 border-3 border-[#2c221e] shadow-[6px_6px_0px_#2c221e] text-[#2c221e] space-y-3"
                >
                  <p className="font-serif italic text-xl font-bold">
                    "Happy Birthday, {gift.recipientNickname}! May your year be as bright and sweet as you are."
                  </p>
                  <button
                    onClick={() => setActiveTab('letter')}
                    className="px-6 py-2.5 rounded-full bg-[#ff5964] text-white text-xs font-bold uppercase tracking-wider border-2 border-[#2c221e] shadow-[3px_3px_0px_#2c221e] hover:bg-[#e04853]"
                  >
                    Open Your Birthday Letter 💌
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'memories' && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#ff5964] font-bold">
                  Party Photo Wall
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2c221e]">
                  Golden Memories
                </h2>
                <p className="text-xs text-[#2c221e]/70">
                  Tap any card to view the memory close-up.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {gift.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className="group cursor-pointer bg-white p-4 pb-5 rounded-2xl border-3 border-[#2c221e] shadow-[6px_6px_0px_#2c221e] hover:shadow-[2px_2px_0px_#2c221e] hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-zinc-100 border-2 border-[#2c221e] mb-3">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="font-serif italic text-sm text-[#2c221e] font-bold">
                      "{photo.caption}"
                    </p>
                    <span className="text-[10px] text-[#ff5964] font-extrabold block mt-1.5 uppercase tracking-wider">
                      {photo.dateOrLocation || `Memory 0${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto bg-white rounded-3xl border-4 border-[#2c221e] shadow-[10px_10px_0px_#2c221e] p-8 sm:p-12 space-y-6 relative overflow-hidden"
            >
              {/* Party bunting card header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#2c221e]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <span className="font-serif italic font-bold text-lg text-[#2c221e]">
                    A Letter For Your Birthday
                  </span>
                </div>
                <span className="text-xs font-bold text-[#ff5964] uppercase tracking-wider">
                  Special Delivery
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#2c221e]">
                {gift.letter.salutation}
              </h3>

              <div className="space-y-4 font-serif text-lg text-[#2c221e]/90 leading-relaxed font-medium">
                {gift.letter.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="pt-6 border-t-2 border-[#2c221e] text-right font-serif italic text-[#ff5964] font-black text-lg">
                {gift.letter.signOff}
              </div>
            </motion.div>
          )}

          {activeTab === 'audio' && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif font-black text-[#2c221e]">
                  Birthday Melodies & Voice
                </h2>
                <p className="text-xs font-medium text-[#2c221e]/70">
                  Hit play to listen to your personal track and voice message!
                </p>
              </div>

              <div className="grid gap-4">
                {gift.audio.songSrc && (
                  <div className="p-6 rounded-2xl bg-white border-3 border-[#2c221e] shadow-[6px_6px_0px_#2c221e] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleSong}
                        className="w-12 h-12 rounded-full bg-[#ff5964] text-white flex items-center justify-center shadow-md border-2 border-[#2c221e] hover:bg-[#e04853]"
                      >
                        {isPlayingSong ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <div>
                        <h4 className="font-extrabold text-base text-[#2c221e]">{gift.audio.songTitle}</h4>
                        <span className="text-xs text-[#2c221e]/60 font-medium">Birthday Track</span>
                      </div>
                    </div>
                  </div>
                )}

                {gift.audio.voiceSrc && (
                  <div className="p-6 rounded-2xl bg-white border-3 border-[#2c221e] shadow-[6px_6px_0px_#2c221e] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleVoice}
                        className="w-12 h-12 rounded-full bg-[#06d6a0] text-[#2c221e] flex items-center justify-center shadow-md border-2 border-[#2c221e] hover:bg-[#05b889]"
                      >
                        {isPlayingVoice ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>
                      <div>
                        <h4 className="font-extrabold text-base text-[#2c221e]">{gift.audio.voiceTitle}</h4>
                        <span className="text-xs text-[#2c221e]/60 font-medium">Personal Voice Note</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto text-center bg-[#ffd166]/40 border-4 border-[#2c221e] shadow-[10px_10px_0px_#2c221e] rounded-3xl p-8 sm:p-12 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#ff5964] border-3 border-[#2c221e] shadow-[4px_4px_0px_#2c221e] flex items-center justify-center text-white mx-auto text-2xl">
                🎂
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2c221e]">
                {gift.finalReveal.title}
              </h2>
              <p className="text-xl font-serif italic text-[#2c221e] font-bold leading-relaxed">
                "{gift.finalReveal.birthdayWish}"
              </p>
              <p className="text-sm font-sans text-[#2c221e]/80 font-medium">
                {gift.finalReveal.closingProse}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
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
              className="bg-white p-6 rounded-3xl border-4 border-[#2c221e] shadow-2xl max-w-lg w-full space-y-4"
            >
              <div className="aspect-4/3 rounded-2xl overflow-hidden border-2 border-[#2c221e] bg-black">
                <img
                  src={gift.photos[selectedPhotoIndex].src}
                  alt={gift.photos[selectedPhotoIndex].alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-serif italic text-lg text-center text-[#2c221e] font-bold">
                "{gift.photos[selectedPhotoIndex].caption}"
              </p>
              <div className="text-center">
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="px-6 py-2 bg-[#ff5964] text-white rounded-full text-xs font-bold uppercase tracking-wider border-2 border-[#2c221e]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
