import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';

const MaintenancePage: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0908] text-[antiquewhite]">
      {/* Soft radial glow, strongest toward top-left */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 18% 12%, rgba(120, 78, 42, 0.45) 0%, rgba(40, 28, 18, 0.2) 35%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <img
          src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/logolight.png"
          alt="AfroSoda"
          className="h-8 w-auto sm:h-9"
        />
        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
          className="text-sm font-semibold tracking-wide text-[antiquewhite]/90 transition-opacity hover:opacity-70"
          aria-label={language === 'en' ? 'Switch to German' : 'Auf Englisch wechseln'}
        >
          {t('navigation', 'language')}
        </button>
      </header>

      {/* Centered content */}
      <main className="relative z-10 flex min-h-[calc(100vh-5.5rem)] flex-col items-center justify-center px-6 pb-16 pt-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a574] sm:text-xs"
        >
          {t('maintenance', 'label')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl font-heading text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
          style={{ color: 'antiquewhite' }}
        >
          {t('maintenance', 'title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-[antiquewhite]/85 sm:text-lg"
        >
          {t('maintenance', 'body')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mt-6 text-base text-[antiquewhite]/85 sm:text-lg"
        >
          {t('maintenance', 'thanks')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.46 }}
          className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:gap-8"
        >
          <Link
            to="/contact"
            className="rounded-2xl bg-[antiquewhite] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#1a1612] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            {t('maintenance', 'contact')}
          </Link>
          <Link
            to="/imprint"
            className="text-sm text-[antiquewhite]/90 underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            {t('maintenance', 'legal')}
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default MaintenancePage;
