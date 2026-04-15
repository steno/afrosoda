import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';

const CallToAction: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="pt-0 pb-20 px-0 bg-purple">
        {/* Decorative Pattern Bar */}
      <div className="relative w-full h-12 md:h-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-repeat-x"
          style={{
            backgroundImage: `url('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/pattern.png ')`,
            backgroundSize: 'auto 80%',
            animation: 'slidePattern 30s linear infinite'
          }}
        />
      </div>
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mt-16 mb-8 font-heading bg-gradient-to-r from-[#ffcc00] via-[#f9a825] to-[#ffcc00] bg-clip-text text-transparent inline-block"
        >
          {t('cta', 'title')}
        </motion.h2>
        <motion.a
          href="https://www.africadrinks.de/"  // AfricaDrinks website
          target="_blank"                    // Optional: opens in new tab
          rel="noopener noreferrer"          // Optional: security for new tab
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-black/10 text-white px-8 py-4 rounded-full text-xl font-bold hover:shadow-lg transition-shadow font-heading"
        >
          {t('cta', 'button')}
        </motion.a>
      </div>
       
    </section>
  );
};

export default CallToAction;