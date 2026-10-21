import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { MemoryPhoto } from '../config/giftConfig';

interface Chapter02MemoriesProps {
  photos: MemoryPhoto[];
  recipientNickname: string;
  onUpdateCaption?: (id: string, newCaption: string) => void;
}

export const Chapter02Memories: React.FC<Chapter02MemoriesProps> = ({
  photos,
  recipientNickname,
  onUpdateCaption,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [editingCaption, setEditingCaption] = useState(false);
  const [tempCaption, setTempCaption] = useState('');

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  useEffect(() => {
    if (selectedPhoto) {
      setTempCaption(selectedPhoto.caption);
      setEditingCaption(false);
    }
  }, [selectedPhotoIndex, selectedPhoto]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPhotoIndex !== null) {
        setSelectedPhotoIndex(null);
      }
      if (selectedPhotoIndex !== null) {
        if (e.key === 'ArrowRight') {
          setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
        } else if (e.key === 'ArrowLeft') {
          setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleSaveCaption = () => {
    if (selectedPhoto && onUpdateCaption) {
      onUpdateCaption(selectedPhoto.id, tempCaption);
    }
    setEditingCaption(false);
  };

  // Distinct ethereal spatial coordinates for floating suspended cards
  const cardPlacements = [
    { top: '14%', left: '8%', mdTop: '16%', mdLeft: '14%', floatClass: 'animate-float-1', delay: 0 },
    { top: '38%', left: '46%', mdTop: '32%', mdLeft: '50%', floatClass: 'animate-float-2', delay: 0.2 },
    { top: '64%', left: '16%', mdTop: '58%', mdLeft: '28%', floatClass: 'animate-float-3', delay: 0.4 },
    { top: '68%', left: '62%', mdTop: '62%', mdLeft: '68%', floatClass: 'animate-float-1', delay: 0.6 },
    { top: '20%', left: '72%', mdTop: '18%', mdLeft: '75%', floatClass: 'animate-float-2', delay: 0.8 },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between py-16 px-4 md:px-12 select-none overflow-hidden">
      {/* Chapter header */}
      <div className="relative z-10 max-w-xl mx-auto text-center pt-4 pb-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-sans block mb-1">
          Chapter 02
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-ivory font-normal">
          Little pieces of us
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans font-light mt-2 max-w-sm mx-auto">
          Fragments suspended in quiet light. Tap any photograph to hold it close.
        </p>
      </div>

      {/* Floating Suspended Objects Canvas Area */}
      <div className="relative flex-1 w-full max-w-6xl mx-auto h-[620px] sm:h-[680px] my-4 flex items-center justify-center">
        {photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center max-w-md mx-auto p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-200/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-5 h-5 text-amber-200/80" />
            </div>
            <p className="text-base font-serif italic text-zinc-200 mb-2">
              Every unrecorded moment we share lives here quietly.
            </p>
            <p className="text-xs text-zinc-400 font-sans font-light">
              No photographs needed — the memory is already etched in us.
            </p>
          </motion.div>
        ) : (
          photos.map((photo, index) => {
            const placement = cardPlacements[index % cardPlacements.length];
            const hasError = imageErrors[photo.id];
            const rotation = photo.rotation ?? (index % 2 === 0 ? -2 : 2.5);

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, delay: placement.delay, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  top: placement.mdTop,
                  left: placement.mdLeft,
                  transform: `rotate(${rotation}deg)`,
                }}
                className={`absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20 ${placement.floatClass}`}
                onClick={() => setSelectedPhotoIndex(index)}
                role="button"
                tabIndex={0}
                aria-label={`Open memory: ${photo.caption || photo.alt}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPhotoIndex(index);
                  }
                }}
              >
                {/* Suspended card container */}
                <div className="relative p-2.5 sm:p-3 rounded-xl bg-zinc-900/70 backdrop-blur-md border border-zinc-700/50 group-hover:border-amber-200/50 group-hover:shadow-[0_0_30px_rgba(240,207,152,0.18)] transition-all duration-300 w-52 sm:w-64">
                  {/* Image frame */}
                  <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-zinc-950/80">
                    {!hasError ? (
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(photo.id)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900/90 border border-zinc-800">
                        <ImageIcon className="w-6 h-6 text-amber-200/40 mb-2" />
                        <span className="text-xs font-serif italic text-zinc-300">
                          {photo.caption || 'A quiet memory'}
                        </span>
                      </div>
                    )}

                    {/* Dark subtle vignette over photo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Hover prompt badge */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] tracking-widest uppercase font-sans text-amber-200 bg-black/60 px-2 py-0.5 rounded-full border border-amber-200/20">
                        Inspect
                      </span>
                  </div>
                </div>

                {/* Subtle caption preview below image */}
                <div className="mt-2.5 px-1 flex items-center justify-between">
                  <span className="text-[11px] font-serif italic text-zinc-300 truncate max-w-[160px]">
                    {photo.dateOrLocation || `Piece 0${index + 1}`}
                  </span>
                  <span className="text-[10px] tabular-nums font-sans text-zinc-500">
                    0{index + 1}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
      </div>

      {/* Focused Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-2xl w-full bg-zinc-950/90 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Control Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="font-serif italic text-amber-200/90">
                    Memory 0{(selectedPhotoIndex ?? 0) + 1}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-sans text-[11px] uppercase tracking-wider text-zinc-400">
                    {selectedPhoto.dateOrLocation || `For ${recipientNickname}`}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-200"
                  aria-label="Return to scene"
                >
                  <span className="font-sans text-[11px]">Return</span>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* High-res Image Showcase */}
              <div className="relative mt-4 aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                {!imageErrors[selectedPhoto.id] ? (
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(selectedPhoto.id)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-8">
                    <ImageIcon className="w-10 h-10 text-amber-200/40 mx-auto mb-3" />
                    <p className="text-zinc-200 text-base font-serif italic">
                      {selectedPhoto.caption || 'A quiet memory'}
                    </p>
                    <p className="text-zinc-400 text-xs font-sans mt-1">
                      {selectedPhoto.dateOrLocation || `For ${recipientNickname}`}
                    </p>
                  </div>
                )}

                {/* Left / Right navigation overlays */}
                <button
                  onClick={() =>
                    setSelectedPhotoIndex((prev) =>
                      prev !== null ? (prev - 1 + photos.length) % photos.length : 0
                    )
                  }
                  aria-label="Previous photograph"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() =>
                    setSelectedPhotoIndex((prev) =>
                      prev !== null ? (prev + 1) % photos.length : 0
                    )
                  }
                  aria-label="Next photograph"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Editable Caption Section */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80">
                {!editingCaption ? (
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-base sm:text-lg font-serif italic text-ivory leading-relaxed">
                      "{selectedPhoto.caption}"
                    </p>
                    {onUpdateCaption && (
                      <button
                        onClick={() => setEditingCaption(true)}
                        className="shrink-0 text-[11px] font-sans uppercase tracking-wider text-amber-200/70 hover:text-amber-200 hover:underline pt-1"
                      >
                        Edit Caption
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-xs font-sans text-zinc-400">
                      Edit memory caption for {recipientNickname}:
                    </label>
                    <textarea
                      value={tempCaption}
                      onChange={(e) => setTempCaption(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-ivory font-serif focus:outline-none focus:border-amber-200"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingCaption(false)}
                        className="px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCaption}
                        className="px-3 py-1 text-xs font-medium bg-amber-200/90 text-zinc-950 rounded hover:bg-amber-100"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-2 text-right">
                  <span className="text-[11px] text-zinc-500 font-sans">
                    Use Esc or the return button to float back
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
