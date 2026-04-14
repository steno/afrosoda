/** Brand palette — order top → bottom (scroll / hero default uses all four). */
export const BRAND_COLORS = {
  red: '#c91713',
  lime: '#b5cf00',
  orange: '#f5821f',
  yellow: '#ffcc00',
} as const;

/** Full palette top → bottom when no product is active (hero / fallback). */
export const DEFAULT_HOME_SCROLL_BG =
  'bg-[linear-gradient(180deg,#c91713_0%,#b5cf00_25%,#f5821f_50%,#ffcc00_100%)]';

export const bottles = [
  {
    color: 'from-[#c91713] to-[#f5821f]',
    gradientBg:
      'bg-[linear-gradient(180deg,#c91713_0%,#b5cf00_50%,#f5821f_100%)]',
    key: 'goldenHibiscus',
    heroImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/single-hibiscus.png?auto=format&fit=crop&w=800&q=80',
    showcaseImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/hib-detail.jpg?auto=format&fit=crop&w=1200&h=1200&q=80',
    link: 'https://www.africadrinks.de/golden-hibiskus'  // Hibiscus
  },
  {
    color: 'from-[#b5cf00] to-[#ffcc00]',
    gradientBg:
      'bg-[linear-gradient(180deg,#b5cf00_0%,#f5821f_50%,#ffcc00_100%)]',
    key: 'kinkyCocomut',
    heroImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/single-coco.png?auto=format&fit=crop&w=800&q=80',
    showcaseImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/coco-detail.jpg?auto=format&fit=crop&w=1200&h=1200&q=80',
    link: 'https://www.africadrinks.de/kinky-coconut'  // Coconut
  },
  {
    color: 'from-[#f5821f] to-[#c91713]',
    gradientBg:
      'bg-[linear-gradient(180deg,#f5821f_0%,#ffcc00_45%,#c91713_100%)]',
    key: 'magicMango',
    heroImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/single-mango.png?auto=format&fit=crop&w=800&q=80',
    showcaseImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/mango-detail.jpg?auto=format&fit=crop&w=1200&h=1200&q=80',
    link: 'https://www.africadrinks.de/magic-mango'  // Mango
  },
  {
    color: 'from-[#ffcc00] to-[#b5cf00]',
    gradientBg:
      'bg-[linear-gradient(180deg,#ffcc00_0%,#f5821f_50%,#b5cf00_100%)]',
    key: 'bubbleBanana',
    heroImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/single-banana.png?auto=format&fit=crop&w=800&q=80',
    showcaseImage: 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/banana-detail.jpg?auto=format&fit=crop&w=1200&h=1200&q=80',
    link: 'https://www.africadrinks.de/bubble-banana'  // Banana
  },
];