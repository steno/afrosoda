import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { bottles, SODA_FIZZ_SOUND_URL, VEGAN_BADGE_IMAGE_URL } from '../../data/bottles';
import { useSodaFizzHover } from '../../hooks/useSodaFizzHover';
import ExternalLink from '../ExternalLink';

interface ProductShowcaseProps {
  productRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ productRefs }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { playFizz, stopFizz } = useSodaFizzHover(SODA_FIZZ_SOUND_URL);

  return (
    <section 
      className="py-20 relative overflow-hidden"
      aria-labelledby="products-title"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
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
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 md:min-h-[85vh]`}
              role="article"
              aria-labelledby={`product-title-${bottle.key}`}
            >
              {/* Bottle Display */}
              <div className="w-full md:w-1/2 flex justify-center md:self-stretch">
                <div
                  className="group w-full max-w-[600px] aspect-square md:max-w-none md:aspect-auto md:h-full relative overflow-hidden rounded-2xl"
                  onMouseEnter={playFizz}
                  onMouseLeave={stopFizz}
                >
                  <motion.img 
                    src={bottle.showcaseImage} 
                    alt={t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                    className="absolute inset-0 z-[1] w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 pointer-events-none z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {Array.from({ length: 36 }, (_, i) => {
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

              {/* Content — white panel, brand stripe + shadow retained */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <motion.div
                  initial={{ x: index % 2 === 0 ? 50 : -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative overflow-hidden rounded-2xl bg-white text-gray-800 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex h-2"
                    aria-hidden
                  >
                    <span className="flex-1 bg-[#c91713]" />
                    <span className="flex-1 bg-[#ffcc00]" />
                    <span className="flex-1 bg-[#b5cf00]" />
                  </div>
                  <div className="relative z-[1] px-8 pt-12 pr-14 pb-16 md:px-10 md:pt-14 md:pr-20 md:pb-20">
                    <h3
                      id={`product-title-${bottle.key}`}
                      className="text-3xl md:text-4xl font-bold mb-4 font-heading"
                      style={{ color: bottle.buttonColor }}
                    >
                      {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                    </h3>
                    <p className="text-lg mb-6 text-gray-700 font-normal normal-case">
                      {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).description}
                    </p>

                    <ExternalLink
                      href={bottle.link}
                      className="mb-8 inline-block text-white px-6 py-3 rounded-full font-bold uppercase hover:shadow-lg transition-all font-heading"
                      style={{ backgroundColor: bottle.buttonColor, fontSize: '1.3em' }}
                      ariaLabel={`${language === 'en' ? 'Order' : 'Bestelle'} ${t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}`}
                      hideIcon
                    >
                      {language === 'en' ? 'Order Now' : 'Jetzt bestellen'}
                    </ExternalLink>

                    <ul
                      className="space-y-2"
                      aria-label={`${t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name} ${language === 'en' ? 'features' : 'Eigenschaften'}`}
                    >
                      {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-5 h-5 shrink-0 text-[#f5821f]" aria-hidden="true">
                            •
                          </span>
                          <span className="text-gray-700 font-normal normal-case">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <img
                    src={VEGAN_BADGE_IMAGE_URL}
                    alt="Vegan"
                    width={56}
                    height={56}
                    className="pointer-events-none absolute bottom-3 right-3 z-[3] w-[2.375rem] h-[2.375rem] md:bottom-4 md:right-4 md:w-14 md:h-14 object-contain select-none"
                    loading="lazy"
                    decoding="async"
                  />
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