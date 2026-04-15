import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { bottles } from '../../data/bottles';

const bottleOpenSound = 'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/bottleopening.mp3';

interface ProductShowcaseProps {
  productRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ productRefs }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playOpenSound = () => {
    if (!soundRef.current) {
      soundRef.current = new Audio(bottleOpenSound);
      soundRef.current.volume = 0.5;
    }
    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(() => {});
  };

  return (
    <section 
      className="py-20 relative overflow-hidden"
      aria-labelledby="products-title"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2"
        aria-hidden="true"
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 
            id="products-title"
            className="text-5xl font-bold mb-8 font-heading bg-gradient-to-r from-[#ffcc00] via-[#f9a825] to-[#ffcc00] bg-clip-text text-transparent inline-block"
          >
            {t('products', 'title')}
          </h2>
        </motion.div>

        <div className="space-y-32">
          {bottles.map((bottle, index) => (
            <motion.div
              key={bottle.key}
              ref={el => productRefs.current[bottle.key] = el}
              id={`product-${bottle.key}`}
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`group flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
              role="article"
              aria-labelledby={`product-title-${bottle.key}`}
            >
              {/* Bottle Display */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div
                  className="w-full max-w-[600px] aspect-square relative overflow-hidden rounded-2xl"
                  onMouseEnter={playOpenSound}
                >
                  <motion.img 
                    src={bottle.showcaseImage} 
                    alt={t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {Array.from({ length: 60 }, (_, i) => {
                      const size = 4 + Math.random() * 12;
                      return (
                        <span
                          key={i}
                          className="absolute rounded-full bg-white/50 bubble-rise aspect-square"
                          style={{
                            width: size,
                            height: size,
                            left: `${Math.random() * 100}%`,
                            bottom: 0,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ x: index % 2 === 0 ? 50 : -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-gray-800"
                >
                  <h3 
                    id={`product-title-${bottle.key}`}
                    className="text-3xl font-bold mb-4 font-heading"
                    style={{ color: bottle.buttonColor }}
                  >
                    {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                  </h3>
                  <p className="text-lg mb-6 text-gray-700">
                    {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).description}
                  </p>
                  
                  {/* Order Now Button */}
                  <motion.a
                    href={bottle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-8 inline-block text-white px-6 py-3 rounded-full font-bold uppercase hover:shadow-lg transition-all font-heading"
                    style={{ backgroundColor: bottle.buttonColor }}
                    aria-label={`${language === 'en' ? 'Order' : 'Bestelle'} ${t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}`}
                  >
                    {language === 'en' ? 'Order Now' : 'Jetzt bestellen'}
                  </motion.a>
                  
                  <ul 
                    className="space-y-2"
                    aria-label={`${t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name} ${language === 'en' ? 'features' : 'Eigenschaften'}`}
                  >
                    {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-5 h-5 text-[#f5821f]" aria-hidden="true">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;