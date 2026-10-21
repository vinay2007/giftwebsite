/**
 * Theme Reveal Renderer
 * Switches dynamically between the 7 distinct theme interactive reveal objects for Chapter 5 / Final Reveal.
 */

import React from 'react';
import { GiftConfig } from '../../config/giftConfig';
import { LoveLetterEnvelope } from '../LoveLetterEnvelope';
import { BirthdayCakeReveal } from './BirthdayCakeReveal';
import { SealedLetterEnvelope } from './SealedLetterEnvelope';
import { SecretGardenFlower } from './SecretGardenFlower';
import { StarlightConstellation } from './StarlightConstellation';
import { ScrapbookBook } from './ScrapbookBook';
import { MinimalLuxuryEnvelope } from './MinimalLuxuryEnvelope';

interface ThemeRevealRendererProps {
  config: GiftConfig;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const ThemeRevealRenderer: React.FC<ThemeRevealRendererProps> = ({
  config,
  onOpenStateChange,
}) => {
  const themeId = (config as unknown as { themeId?: string }).themeId || config.templateId || 'moonlit-romance';

  switch (themeId) {
    case 'birthday-cake':
      return <BirthdayCakeReveal config={config} onOpenStateChange={onOpenStateChange} />;
    case 'sealed-letter':
      return <SealedLetterEnvelope config={config} onOpenStateChange={onOpenStateChange} />;
    case 'secret-garden':
      return <SecretGardenFlower config={config} onOpenStateChange={onOpenStateChange} />;
    case 'starlight-memories':
      return <StarlightConstellation config={config} onOpenStateChange={onOpenStateChange} />;
    case 'scrapbook-us':
      return <ScrapbookBook config={config} onOpenStateChange={onOpenStateChange} />;
    case 'minimal-luxury':
      return <MinimalLuxuryEnvelope config={config} onOpenStateChange={onOpenStateChange} />;
    case 'moonlit-romance':
    default:
      return <LoveLetterEnvelope config={config} onOpenStateChange={onOpenStateChange} />;
  }
};
