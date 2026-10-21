import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChapterMeta } from '../config/giftConfig';

interface ChapterNavigationProps {
  chapters: ChapterMeta[];
  activeChapterIndex: number;
  onSelectChapter: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isOpeningEntered: boolean;
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  chapters,
  activeChapterIndex,
  onSelectChapter,
  onNext,
  onPrev,
  isOpeningEntered,
}) => {
  // If the user hasn't stepped into chapter 01 yet, keep navigation completely quiet
  if (!isOpeningEntered) return null;

  const currentChapter = chapters[activeChapterIndex] || chapters[0] || {
    id: 'world',
    number: '01',
    title: 'Chapter 01',
    subtitle: '',
    enabled: true,
  };
  const canGoPrev = activeChapterIndex > 0;
  const canGoNext = activeChapterIndex < chapters.length - 1;

  return (
    <nav
      aria-label="Chapter navigation"
      className="fixed bottom-6 inset-x-0 z-40 flex items-center justify-between px-6 md:px-12 pointer-events-none"
    >
      {/* Previous chapter control */}
      <div className="pointer-events-auto">
        {canGoPrev ? (
          <button
            onClick={onPrev}
            aria-label={`Previous chapter: ${chapters[activeChapterIndex - 1]?.title}`}
            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors py-2 px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-200/50"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline font-sans">Previous</span>
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* Center chapter indicators & editorial progress */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 text-xs tracking-wider text-zinc-400">
          <span className="font-serif italic text-zinc-300 text-sm">
            {currentChapter.title}
          </span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="font-sans tabular-nums text-zinc-400">
            {currentChapter.number} of 0{chapters.length}
          </span>
        </div>

        {/* Minimal indicator line / segments */}
        <div className="flex items-center gap-2">
          {chapters.map((chap, idx) => {
            const isActive = idx === activeChapterIndex;
            return (
              <button
                key={chap.id}
                onClick={() => onSelectChapter(idx)}
                aria-label={`Go to chapter ${chap.number}: ${chap.title}`}
                className="group py-2 px-1 focus-visible:outline-none"
              >
                <div
                  className={`h-0.5 transition-all duration-500 rounded-full ${
                    isActive
                      ? 'w-8 bg-amber-200/90'
                      : 'w-3 bg-zinc-700/60 hover:bg-zinc-500 hover:w-5'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Next chapter control */}
      <div className="pointer-events-auto">
        {canGoNext ? (
          <button
            onClick={onNext}
            aria-label={`Next chapter: ${chapters[activeChapterIndex + 1]?.title}`}
            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors py-2 px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-200/50"
          >
            <span className="hidden sm:inline font-sans">Next</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>
    </nav>
  );
};
