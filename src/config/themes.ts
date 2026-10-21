/**
 * Theme Gallery Definitions for Somewhere Between Us
 * Defines the 8 distinct color palettes, visual styles, backgrounds, typography, and decorative patterns.
 */

export interface GiftThemeMeta {
  id: string;
  name: string;
  tagline: string;
  mood: string;
  description: string;
  bgClass: string;
  cardBgClass: string;
  borderColorClass: string;
  textColorClass: string;
  accentColor: string;
  secondaryAccent: string;
  primaryFont: string;
  paletteColors: string[];
  signatureRevealName: string;
}

export const GIFT_THEMES: GiftThemeMeta[] = [
  {
    id: 'midnight-romance',
    name: 'Midnight Romance',
    tagline: 'Deep black, charcoal, warm ivory, and muted silver',
    mood: 'Cinematic and intimate',
    description: 'Deep black and charcoal canvas with warm ivory highlights, moonlight ambiance, and tiny stars.',
    bgClass: 'bg-[#070709]',
    cardBgClass: 'bg-[#121216]/90',
    borderColorClass: 'border-zinc-700/60',
    textColorClass: 'text-zinc-100',
    accentColor: '#f0cf98',
    secondaryAccent: '#a1a1aa',
    primaryFont: 'Cormorant Garamond',
    paletteColors: ['#070709', '#18181b', '#f6f3ec', '#a1a1aa', '#f0cf98'],
    signatureRevealName: 'Sealed Envelope & Moonlight',
  },
  {
    id: 'rose-garden',
    name: 'Rose Garden',
    tagline: 'Dusty pink, blush, burgundy, and soft cream',
    mood: 'Romantic and feminine',
    description: 'Rich burgundy shadows paired with dusty pink, soft cream, and delicate rose floral tones.',
    bgClass: 'bg-[#150a0f]',
    cardBgClass: 'bg-[#211118]/90',
    borderColorClass: 'border-pink-500/30',
    textColorClass: 'text-pink-50',
    accentColor: '#f4b8c6',
    secondaryAccent: '#9f1239',
    primaryFont: 'Playfair Display',
    paletteColors: ['#150a0f', '#4c0519', '#f4b8c6', '#fdf2f4', '#fda4af'],
    signatureRevealName: 'Blush Envelope & Rose Crest',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    tagline: 'Champagne gold, warm beige, caramel, and amber',
    mood: 'Luxurious and warm',
    description: 'Sun-drenched champagne gold, warm beige, caramel tones, and amber sunset accents.',
    bgClass: 'bg-[#17120a]',
    cardBgClass: 'bg-[#241c10]/90',
    borderColorClass: 'border-amber-500/30',
    textColorClass: 'text-amber-50',
    accentColor: '#f5d061',
    secondaryAccent: '#d97706',
    primaryFont: 'Fraunces',
    paletteColors: ['#17120a', '#451a03', '#f5d061', '#fef3c7', '#d97706'],
    signatureRevealName: 'Caramel Envelope & Gold Wax',
  },
  {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    tagline: 'Soft lavender, lilac, pale pink, and creamy white',
    mood: 'Dreamy, delicate, and elegant',
    description: 'Enchanting soft lavender and lilac gradients paired with creamy white and pale rose highlights.',
    bgClass: 'bg-[#110f1c]',
    cardBgClass: 'bg-[#1c182c]/90',
    borderColorClass: 'border-purple-400/30',
    textColorClass: 'text-purple-50',
    accentColor: '#d8b4fe',
    secondaryAccent: '#9333ea',
    primaryFont: 'Cormorant Garamond',
    paletteColors: ['#110f1c', '#3b0764', '#d8b4fe', '#faf5ff', '#c084fc'],
    signatureRevealName: 'Lilac Envelope & Lavender Seal',
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Luxury',
    tagline: 'Deep emerald green, forest green, ivory, and restrained gold',
    mood: 'Rich, sophisticated, and premium',
    description: 'Deep forest and emerald greens accented with ivory stationery and sophisticated gold trim.',
    bgClass: 'bg-[#06140f]',
    cardBgClass: 'bg-[#0f241c]/90',
    borderColorClass: 'border-emerald-500/30',
    textColorClass: 'text-emerald-50',
    accentColor: '#d4af37',
    secondaryAccent: '#059669',
    primaryFont: 'Playfair Display',
    paletteColors: ['#06140f', '#064e3b', '#d4af37', '#ecfdf5', '#10b981'],
    signatureRevealName: 'Forest Envelope & Gold Crest',
  },
  {
    id: 'ocean-love',
    name: 'Ocean Love',
    tagline: 'Deep ocean blue, turquoise, seafoam, and pearl white',
    mood: 'Calm, refreshing, and dreamy',
    description: 'Serene deep ocean navy paired with vibrant turquoise, seafoam highlights, and pearl white.',
    bgClass: 'bg-[#070e17]',
    cardBgClass: 'bg-[#0f1c2e]/90',
    borderColorClass: 'border-cyan-500/30',
    textColorClass: 'text-cyan-50',
    accentColor: '#7dd3fc',
    secondaryAccent: '#0ea5e9',
    primaryFont: 'Plus Jakarta Sans',
    paletteColors: ['#070e17', '#0369a1', '#7dd3fc', '#f0f9ff', '#38bdf8'],
    signatureRevealName: 'Ocean Envelope & Pearl Seal',
  },
  {
    id: 'cherry-pop',
    name: 'Cherry Pop',
    tagline: 'Cherry red, pale pink, crisp white, and deep burgundy',
    mood: 'Bold, playful, youthful, and energetic',
    description: 'Vibrant cherry red and crisp white contrast with pale pink and deep burgundy accents.',
    bgClass: 'bg-[#1c080d]',
    cardBgClass: 'bg-[#2e1017]/90',
    borderColorClass: 'border-red-500/30',
    textColorClass: 'text-red-50',
    accentColor: '#fb7185',
    secondaryAccent: '#e11d48',
    primaryFont: 'Plus Jakarta Sans',
    paletteColors: ['#1c080d', '#881337', '#fb7185', '#fff1f2', '#f43f5e'],
    signatureRevealName: 'Cherry Envelope & Rose Crest',
  },
  {
    id: 'vintage-memories',
    name: 'Vintage Memories',
    tagline: 'Muted brown, antique cream, terracotta, and faded olive',
    mood: 'Nostalgic, artistic, and scrapbook-inspired',
    description: 'Warm antique parchment textures, muted brown, terracotta, and faded olive scrapbook tones.',
    bgClass: 'bg-[#171310]',
    cardBgClass: 'bg-[#241c16]/90',
    borderColorClass: 'border-amber-700/30',
    textColorClass: 'text-amber-100',
    accentColor: '#d4a373',
    secondaryAccent: '#bc6c25',
    primaryFont: 'Fraunces',
    paletteColors: ['#171310', '#603813', '#d4a373', '#fefae0', '#bc6c25'],
    signatureRevealName: 'Antique Parchment Envelope',
  },
];

export function getThemeMeta(themeId?: string): GiftThemeMeta {
  return GIFT_THEMES.find((t) => t.id === themeId) || GIFT_THEMES[0];
}
