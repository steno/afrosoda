import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

 
interface FullScreenMenuProps {
  onClose: () => void;
  t: any;
  language: string;
}

const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ onClose, t, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50"
    >
     
      {/* Colorful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-500" />
      
      {/* Content with backdrop blur */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-12 backdrop-blur-md bg-black/10 rounded-3xl border border-white/20">
          <div className="flex justify-end mb-8">
            <button
              onClick={onClose}
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
                    className="hover:text-yellow-300 transition-colors text-white"
                    onClick={() => {
                      onClose();
                      window.scrollTo(0, 0);
                    }}
                  >
                    {t('menu', 'about')}
                  </Link>
                </li>
                
                <li>
                  <Link 
                    to="/contact" 
                    className="hover:text-yellow-300 transition-colors text-white"
                    onClick={() => {
                      onClose();
                      window.scrollTo(0, 0);
                    }}
                  >
                    {language === 'en' ? 'Contact' : 'Kontakt'}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="hover:text-yellow-300 transition-colors text-white"
                    onClick={() => {
                      onClose();
                      window.scrollTo(0, 0);
                    }}
                  >
                    {t('menu', 'privacy')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/imprint" 
                    className="hover:text-yellow-300 transition-colors text-white"
                    onClick={() => {
                      onClose();
                      window.scrollTo(0, 0);
                    }}
                  >
                    {t('menu', 'imprint')}
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
  );
};

export default FullScreenMenu;