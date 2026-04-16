/** Brand palette — order top → bottom (scroll / hero default uses all four). */
export const BRAND_COLORS = {
  red: '#c91713',
  lime: '#b5cf00',
  orange: '#f5821f',
  yellow: '#ffcc00',
} as const;

/** Warm sunburst-style fallback when no product is active. */
export const DEFAULT_HOME_SCROLL_BG =
  'bg-[linear-gradient(180deg,#8b0f0d_0%,#c91713_20%,#f5821f_35%,#ffcc00_50%,#ffe566_62%,#b5cf00_78%,#8aab00_100%)]';

/** Fizz SFX on bottle image hover (`media/music` in Supabase public bucket). */
export const SODA_FIZZ_SOUND_URL =
  'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/sodafizz.mp3';

/** Vegan seal on product showcase cards (`media/images` in Supabase public bucket). */
export const VEGAN_BADGE_IMAGE_URL =
  'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/vegan.png';

export const bottles = [
  {
    color: 'from-[#c91713] to-[#f5821f]',
    buttonColor: '#c91713',
    gradientBg:
      'bg-[linear-gradient(180deg,#c91713_0%,#e85d04_50%,#f5821f_100%)]',
    key: 'goldenHibiscus',
    heroImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/single-hibiscus.png?auto=format&fit=crop&w=800&q=80',
    showcaseImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/hib-detail.png?auto=format&fit=crop&w=1200&h=1200&q=80',
    link: 'https://www.africadrinks.de/golden-hibiskus'  // Hibiscus
  },
  {
    color: 'from-[#f5821f] to-[#ffcc00]',
    buttonColor: '#f5821f',
    gradientBg:
      'bg-[linear-gradient(180deg,#f5821f_0%,#f9a825_50%,#ffcc00_100%)]',
    key: 'magicMango',
    heroImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/single-mango.png?auto=format&fit=crop&w=800&q=80',
    showcaseImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/mango-detail.png?auto=format&fit=crop&w=1200&h=1200&q=80',
    link: 'https://www.africadrinks.de/magic-mango'  // Mango
  },
  {
    color: 'from-[#ffcc00] to-[#f5821f]',
    buttonColor: '#ffcc00',
    gradientBg:
      'bg-[linear-gradient(180deg,#ffcc00_0%,#f9a825_50%,#f5821f_100%)]',
    key: 'bubbleBanana',
    heroImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/single-banana.png?auto=format&fit=crop&w=800&q=80',
    showcaseImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/banana-detail.png?auto=format&fit=crop&w=1200&h=1200&q=80',
    link: 'https://www.africadrinks.de/bubble-banana'  // Banana
  },
  {
    color: 'from-[#b5cf00] to-[#ffcc00]',
    buttonColor: '#b5cf00',
    gradientBg:
      'bg-[linear-gradient(180deg,#8aab00_0%,#b5cf00_45%,#ffcc00_100%)]',
    key: 'kinkyCocomut',
    heroImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/single-coco.png?auto=format&fit=crop&w=800&q=80',
    showcaseImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/coco-detail.png?auto=format&fit=crop&w=1200&h=1200&q=80',
    link: 'https://www.africadrinks.de/kinky-coconut'  // Coconut
  },
];