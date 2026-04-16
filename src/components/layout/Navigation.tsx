import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, 
  Menu, 
  Globe
} from 'lucide-react';
import TikTokIcon from '../icons/TikTokIcon';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import FullScreenMenu from './FullScreenMenu';

interface NavigationProps {
  isMobile: boolean;
  scrollToTop: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile, scrollToTop }) => {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#c91713] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Social Media Icons - Left side on desktop, hidden on mobile */}
            <div className="hidden md:flex items-center gap-4">
              <a href="https://www.instagram.com/afrosodaofficial" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@afrosoda12" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>

            {/* Logo - Left aligned on mobile, centered on desktop */}
            <div className={`${isMobile ? 'flex items-center' : 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}`}>
              <h1 className="sr-only">AfroSoda</h1>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <Link to="/" onClick={scrollToTop}>
                  <img src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/logolight.png" 
                    alt="AfroSoda Logo"
                    className="h-[2em] w-auto"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Desktop page links; hamburger only on small screens */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link
                  to="/about"
                  onClick={scrollToTop}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {t('menu', 'about')}
                </Link>
                <Link
                  to="/contact"
                  onClick={scrollToTop}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {language === 'en' ? 'Contact' : 'Kontakt'}
                </Link>
              </div>
              <button
                onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                {t('navigation', 'language')}
              </button>

              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="text-white/70 hover:text-white transition-colors md:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <FullScreenMenu 
            onClose={() => setIsMenuOpen(false)} 
            t={t} 
            language={language}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;