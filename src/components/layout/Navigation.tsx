import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Menu, 
  X, 
  Globe
} from 'lucide-react';
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Social Media Icons - Left side on desktop, hidden on mobile */}
            <div className="hidden md:flex items-center gap-4">
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
                    className="h-8"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Language Toggle and Menu */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                {t('navigation', 'language')}
              </button>

              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-white/70 hover:text-white transition-colors"
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