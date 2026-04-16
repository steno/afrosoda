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
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5821f] via-[#d4451f] to-[#c91713]" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="w-full max-w-2xl px-8 py-10 md:px-12 md:py-14 backdrop-blur-xl bg-white/10 rounded-[2rem] border border-white/15 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <Link
              to="/"
              onClick={() => {
                onClose();
                window.scrollTo(0, 0);
              }}
            >
              <img
                src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/logolight.png"
                alt="AfroSoda Logo"
                className="h-10"
              />
            </Link>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
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
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/90"
            >
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