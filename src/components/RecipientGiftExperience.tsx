import React from 'react';
import { GiftData } from '../config/giftConfig';
import { MidnightRomanceTheme } from './themes/MidnightRomanceTheme';
import { BirthdayWonderlandTheme } from './themes/BirthdayWonderlandTheme';
import { SecretGardenTheme } from './themes/SecretGardenTheme';
import { OurScrapbookTheme } from './themes/OurScrapbookTheme';

interface RecipientGiftExperienceProps {
  gift: GiftData;
  onBackToEditor?: () => void;
  isPreviewMode?: boolean;
}

export const RecipientGiftExperience: React.FC<RecipientGiftExperienceProps> = ({
  gift,
  onBackToEditor,
  isPreviewMode = false,
}) => {
  const themeStyle = gift.theme?.themeStyle || 'midnight';

  if (themeStyle === 'wonderland') {
    return <BirthdayWonderlandTheme gift={gift} onBackToEditor={onBackToEditor} isPreviewMode={isPreviewMode} />;
  }
  if (themeStyle === 'garden') {
    return <SecretGardenTheme gift={gift} onBackToEditor={onBackToEditor} isPreviewMode={isPreviewMode} />;
  }
  if (themeStyle === 'scrapbook') {
    return <OurScrapbookTheme gift={gift} onBackToEditor={onBackToEditor} isPreviewMode={isPreviewMode} />;
  }

  // Default: Midnight Romance Theme
  return <MidnightRomanceTheme gift={gift} onBackToEditor={onBackToEditor} isPreviewMode={isPreviewMode} />;
};
