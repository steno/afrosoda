import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Menu, 
  X, 
  Globe,
  Clock
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import BackToTop from './BackToTop';
import AudioControls from './AudioControls';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { t } = useTranslation();
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  const isPrivacyPage = location.pathname === '/privacy';
  const isContactPage = location.pathname === '/contact';

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Function to scroll to top when clicking the logo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden relative">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left section - Social icons on desktop, empty on mobile */}
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

            {/* Center section - Logo centered on desktop, left-aligned on mobile */}
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

      {/* Sound Controls */}
      <AudioControls />

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            {/* Colorful gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-500" />
            
            {/* Animated floating bubbles */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    opacity: [0.1, 0.3, 0.1],
                    scale: [0, 1],
                    y: [
                      Math.random() * window.innerHeight,
                      Math.random() * window.innerHeight - 100,
                      Math.random() * window.innerHeight
                    ],
                    x: [
                      Math.random() * window.innerWidth,
                      Math.random() * window.innerWidth - 100,
                      Math.random() * window.innerWidth
                    ],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 20 + Math.random() * 10,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  style={{
                    width: 50 + Math.random() * 150,
                    height: 50 + Math.random() * 150,
                  }}
                />
              ))}
            </div>
            
            {/* Animated glowing orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`orb-${i}`}
                  className="absolute rounded-full"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: 0
                  }}
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.5, 1.5, 1],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    width: 200 + Math.random() * 300,
                    height: 200 + Math.random() * 300,
                    background: `radial-gradient(circle, ${
                      i % 3 === 0 ? 'rgba(236, 72, 153, 0.3)' : 
                      i % 3 === 1 ? 'rgba(124, 58, 237, 0.3)' : 
                      'rgba(249, 115, 22, 0.3)'
                    } 0%, transparent 70%)`,
                    filter: 'blur(40px)'
                  }}
                />
              ))}
            </div>
            
            {/* Content with backdrop blur */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="max-w-4xl mx-auto px-4 py-12 backdrop-blur-md bg-black/10 rounded-3xl border border-white/20">
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-yellow-300 transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  {/* Menu Items */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ul className="space-y-6 text-2xl font-heading">
                      <li>
                        <Link 
                          to="/about" 
                          className={`hover:text-yellow-300 transition-colors ${location.pathname === '/about' ? 'text-yellow-300' : 'text-white'}`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {t('menu', 'about')}
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/privacy" 
                          className={`hover:text-yellow-300 transition-colors ${location.pathname === '/privacy' ? 'text-yellow-300' : 'text-white'}`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {t('menu', 'privacy')}
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/contact" 
                          className={`hover:text-yellow-300 transition-colors ${location.pathname === '/contact' ? 'text-yellow-300' : 'text-white'}`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {language === 'en' ? 'Contact' : 'Kontakt'}
                        </Link>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Contact Information */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/90"
                  >
                    <h3 className="text-xl font-bold text-white mb-4 font-heading">
                      {t('contact', 'title')}
                    </h3>
                    <div className="space-y-2">
                      <p className="font-medium text-white">
                        {t('contact', 'company')}
                      </p>
                      {Array.isArray(t('contact', 'address')) && 
                        t('contact', 'address').map((line: string, index: number) => (
                          <p key={index}>{line}</p>
                        ))}
                      <div className="pt-4 space-y-1">
                        <p>{t('contact', 'phone')}</p>
                        <p>{t('contact', 'email')}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center bg-purple mytexture text-white/70">
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
              {!isAboutPage && (
                <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">
                  {t('menu', 'about')}
                </Link>
              )}
              {!isPrivacyPage && (
                <Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">
                  {t('menu', 'privacy')}
                </Link>
              )}
              {!isContactPage && (
                <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">
                  {language === 'en' ? 'Contact' : 'Kontakt'}
                </Link>
              )}
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

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Layout;