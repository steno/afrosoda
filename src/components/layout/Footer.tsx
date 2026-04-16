import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import TikTokIcon from '../icons/TikTokIcon';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  scrollToTop: () => void;
}

const Footer: React.FC<FooterProps> = ({ scrollToTop }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <footer className="pt-6 px-4 pb-10 sm:pb-12 bg-[#c91713] text-sm text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 w-full min-w-0">
          <Link to="/" onClick={scrollToTop} className="shrink-0">
            <img
              src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/footer-logo.png"
              alt="AfroSoda Logo"
              className="h-14 w-auto sm:h-16 md:h-20 lg:h-24 opacity-100"
            />
          </Link>

          <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 text-center flex-1 min-w-0 px-1 sm:px-2 text-xs sm:text-sm">
            <p className="leading-snug">{t('footer', 'copyright')}</p>
            <p className="flex flex-wrap items-center justify-center gap-x-0 leading-snug">
              <Link to="/privacy" className="hover:text-white/90 transition-colors whitespace-nowrap">
                {language === 'en' ? 'Privacy Policy' : 'Datenschutzerklärung'}
              </Link>
              <span className="mx-1" aria-hidden>
                |
              </span>
              <Link to="/imprint" className="hover:text-white/90 transition-colors whitespace-nowrap">
                {language === 'en' ? 'Imprint' : 'Impressum'}
              </Link>
              <span className="mx-1" aria-hidden>
                |
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window && (window as any).openCookieSettings) {
                    (window as any).openCookieSettings();
                  }
                }}
                className="hover:text-white/90 transition-colors whitespace-nowrap"
              >
                {language === 'en' ? 'Cookie Settings' : 'Cookie-Einstellungen'}
              </button>
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0">
            <a href="https://www.instagram.com/afrosodaofficial" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.tiktok.com/@afrosoda12" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
              <TikTokIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;