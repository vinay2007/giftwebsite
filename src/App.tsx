/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GiftData, initialGiftConfig } from './config/giftConfig';
import {
  getAllDrafts,
  saveDraft,
  deleteDraft,
  duplicateDraft,
  hydrateGiftMedia,
  createNewGiftDraft,
  revokeActiveObjectUrls,
} from './services/giftStorage';
import { LandingPage } from './components/LandingPage';
import { GiftCreationWizard } from './components/GiftCreationWizard';
import { RecipientGiftExperience } from './components/RecipientGiftExperience';
import { fetchPublishedGift } from './services/publishService';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

type AppView = 'landing' | 'wizard' | 'preview' | 'demo' | 'published';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [activeGift, setActiveGift] = useState<GiftData>(initialGiftConfig);
  const [savedDrafts, setSavedDrafts] = useState<GiftData[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [isLoadingPublishedGift, setIsLoadingPublishedGift] = useState<boolean>(false);
  const [publishedLoadError, setPublishedLoadError] = useState<string | null>(null);

  const autoSaveTimerRef = useRef<number | null>(null);

  // Load saved drafts from IndexedDB on startup
  const loadDraftsList = useCallback(async () => {
    try {
      const drafts = await getAllDrafts();
      setSavedDrafts(drafts);
    } catch (err) {
      console.warn('Could not load drafts from IndexedDB', err);
    }
  }, []);

  useEffect(() => {
    loadDraftsList();

    // Check if visitor opened a public gift link (/gift/:id or ?gift=:id)
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    let publicId: string | null = null;

    if (pathname.startsWith('/gift/')) {
      const clean = pathname.replace('/gift/', '').split('/')[0];
      if (clean) publicId = clean;
    } else if (params.get('gift')) {
      publicId = params.get('gift');
    }

    if (publicId) {
      setIsLoadingPublishedGift(true);
      setPublishedLoadError(null);
      fetchPublishedGift(publicId)
        .then((gift) => {
          setActiveGift(gift);
          setView('published');
        })
        .catch((err) => {
          console.error('Failed to load published gift:', err);
          setPublishedLoadError(err.message || 'Could not find this published gift.');
        })
        .finally(() => {
          setIsLoadingPublishedGift(false);
        });
    } else if (params.get('view') === 'demo') {
      setActiveGift(initialGiftConfig);
      setView('demo');
    }

    return () => {
      revokeActiveObjectUrls();
    };
  }, [loadDraftsList]);

  // Debounced auto-save to IndexedDB
  const handleGiftChange = useCallback((updated: GiftData) => {
    setActiveGift(updated);

    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = window.setTimeout(async () => {
      try {
        await saveDraft(updated);
        setLastSavedAt(Date.now());
        loadDraftsList();
      } catch (e) {
        console.warn('Auto-save failed', e);
      }
    }, 1200);
  }, [loadDraftsList]);

  const handleManualSave = useCallback(async () => {
    try {
      await saveDraft(activeGift);
      setLastSavedAt(Date.now());
      await loadDraftsList();
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  }, [activeGift, loadDraftsList]);

  // Start new draft from scratch
  const handleStartCreate = useCallback(() => {
    const freshDraft = createNewGiftDraft('birthday');
    setActiveGift(freshDraft);
    setView('wizard');
    // Save initial record immediately
    saveDraft(freshDraft).then(() => {
      setLastSavedAt(Date.now());
      loadDraftsList();
    });
  }, [loadDraftsList]);

  // Open existing draft
  const handleOpenDraft = useCallback(async (draft: GiftData) => {
    try {
      const hydrated = await hydrateGiftMedia(draft);
      setActiveGift(hydrated);
      setView('wizard');
    } catch (err) {
      console.error('Error hydrating draft', err);
      setActiveGift(draft);
      setView('wizard');
    }
  }, []);

  // Duplicate draft
  const handleDuplicateDraft = useCallback(async (id: string) => {
    try {
      await duplicateDraft(id);
      await loadDraftsList();
    } catch (err) {
      console.error('Failed to duplicate draft', err);
    }
  }, [loadDraftsList]);

  // Delete draft with confirmation
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteCandidateId) return;
    try {
      await deleteDraft(deleteCandidateId);
      setDeleteCandidateId(null);
      await loadDraftsList();
    } catch (err) {
      console.error('Failed to delete draft', err);
    }
  }, [deleteCandidateId, loadDraftsList]);

  // Explore sample experience (supports choosing any of the 4 themes)
  const handleExploreDemo = useCallback((themeStyle?: 'midnight' | 'wonderland' | 'garden' | 'scrapbook') => {
    setActiveGift({
      ...initialGiftConfig,
      theme: {
        ...initialGiftConfig.theme,
        themeStyle: themeStyle || 'midnight',
      },
    });
    setView('demo');
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#070709] text-zinc-100">
      {/* 1. Public Landing Page */}
      {view === 'landing' && (
        <LandingPage
          onStartCreate={handleStartCreate}
          onExploreDemo={handleExploreDemo}
          savedDrafts={savedDrafts}
          onOpenDraft={handleOpenDraft}
          onDuplicateDraft={handleDuplicateDraft}
          onDeleteDraft={(id) => setDeleteCandidateId(id)}
        />
      )}

      {/* 2. Step-by-Step Gift Creation Wizard */}
      {view === 'wizard' && (
        <GiftCreationWizard
          gift={activeGift}
          onChange={handleGiftChange}
          onSaveDraft={handleManualSave}
          onEnterRecipientPreview={() => setView('preview')}
          onExitToLanding={() => setView('landing')}
          lastSavedAt={lastSavedAt}
        />
      )}

      {/* 3. Recipient Preview (opened from Wizard with "Back to Editor") */}
      {view === 'preview' && (
        <RecipientGiftExperience
          gift={activeGift}
          onBackToEditor={() => setView('wizard')}
          isPreviewMode={true}
        />
      )}

      {/* 4. Demo Experience (renders selected theme) */}
      {view === 'demo' && (
        <RecipientGiftExperience
          gift={activeGift}
          onBackToEditor={() => setView('landing')}
          isPreviewMode={true}
        />
      )}

      {/* 5. Real Published Gift Experience (recipient opens without login) */}
      {view === 'published' && (
        <RecipientGiftExperience
          gift={activeGift}
          isPreviewMode={false}
        />
      )}

      {/* Loading Published Gift Indicator */}
      {isLoadingPublishedGift && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070709] text-zinc-100 p-6 space-y-4 text-center">
          <Loader2 className="w-8 h-8 text-amber-200 animate-spin" />
          <h2 className="text-xl sm:text-2xl font-serif text-ivory">Opening your gift...</h2>
          <p className="text-xs text-zinc-400 font-sans max-w-sm">
            Retrieving personal memories and message from the cloud.
          </p>
        </div>
      )}

      {/* Error Loading Published Gift */}
      {publishedLoadError && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070709] text-zinc-100 p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 text-2xl">
            💌
          </div>
          <h2 className="text-2xl font-serif text-ivory">Gift Not Found</h2>
          <p className="text-xs text-zinc-400 font-sans max-w-sm leading-relaxed">
            {publishedLoadError}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setPublishedLoadError(null);
                window.location.href = '/';
              }}
              className="px-6 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-sans text-ivory transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}

      {/* Delete Draft Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif text-lg text-ivory">Delete this draft?</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              This will permanently delete this gift and any uploaded images or audio stored in this browser. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
