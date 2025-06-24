import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { bottles } from '../../data/bottles';
import ExternalLink from '../ExternalLink';

interface ProductShowcaseProps {
  productRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ productRefs }) => {
  const { language } = useLanguage();
  const { t } = useTranslation();

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
            className="text-5xl font-bold mb-8 font-heading"
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
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
              role="article"
              aria-labelledby={`product-title-${bottle.key}`}
            >
              {/* Bottle Display */}
              <div className="w-full md:w-1/2 flex justify-center">
                <motion.div 
                  className="w-full max-w-[600px] aspect-square relative overflow-hidden rounded-3xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={bottle.showcaseImage} 
                    alt={t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div 
                    className={`absolute inset-0 bg-gradient-to-t ${bottle.color} mix-blend-overlay opacity-30`}
                    aria-hidden="true"
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ x: index % 2 === 0 ? 50 : -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-black/20 backdrop-blur-lg rounded-3xl p-8"
                >
                  <h3 
                    id={`product-title-${bottle.key}`}
                    className="text-3xl font-bold mb-4 font-heading"
                  >
                    {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                  </h3>
                  <p className="text-lg mb-6 opacity-90">
                    {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).description}
                  </p>
                  
                  {/* Order Now Button */}
                  <ExternalLink
                    href={bottle.link}
                    className={`mb-8 inline-flex items-center gap-2 bg-gradient-to-r ${bottle.color} text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all font-heading`}
                    ariaLabel={`${language === 'en' ? 'Order' : 'Bestelle'} ${t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}`}
                  >
                    <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                    {language === 'en' ? 'Order Now' : 'Jetzt bestellen'}
                  </ExternalLink>
                  
                  <ul 
                    className="space-y-2"
                    aria-label={`${t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name} ${language === 'en' ? 'features' : 'Eigenschaften'}`}
                  >
                    {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-5 h-5 text-yellow-300" aria-hidden="true">•</span>
                        <span>{feature}</span>
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