import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  scrollToTop: () => void;
}

const Footer: React.FC<FooterProps> = ({ scrollToTop }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <footer className="py-8 px-4 mytexture bg-purple text-center text-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Link to="/" onClick={scrollToTop} className="mb-4 md:mb-0">
            <img 
              src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/logolight.png" 
              alt="AfroSoda Logo" 
              className="h-8"
            />
          </Link>
          <div className="flex gap-6">
            <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">
              {t('menu', 'about')}
            </Link>
            <Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">
              {t('menu', 'privacy')}
            </Link>
            <Link to="/imprint" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">
              {t('menu', 'imprint')}
            </Link>
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">
              {language === 'en' ? 'Contact' : 'Kontakt'}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        <p>{t('footer', 'copyright')}</p>
        <p className="mt-2">
          <Link to="/privacy" className="hover:text-white transition-colors">
            {language === 'en' ? 'Privacy Policy' : 'Datenschutzerklärung'}
          </Link>
          {' | '}
          <Link to="/imprint" className="hover:text-white transition-colors">
            {language === 'en' ? 'Imprint' : 'Impressum'}
          </Link>
          {' | '}
          <button 
            onClick={() => {
              if (window && (window as any).openCookieSettings) {
                (window as any).openCookieSettings();
              }
            }}
            className="hover:text-white transition-colors"
          >
            {language === 'en' ? 'Cookie Settings' : 'Cookie-Einstellungen'}
          </button>
        </p>
      </div>
    </footer>
  );
};

export default Footer;