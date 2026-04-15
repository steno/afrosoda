import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import Bubble from '../animations/Bubble';
import RollingBottleCap from '../animations/RollingBottleCap';
import Sunburst from '../animations/Sunburst';
import { bottles } from '../../data/bottles';

interface HeroProps {
  isMobile: boolean;
  currentBottleIndex: number;
  setCurrentBottleIndex: (index: number) => void;
  hoveredBottle: string | null;
  setHoveredBottle: (bottle: string | null) => void;
  playBottleSound: (bottleKey: string) => void;
  scrollToProduct: (bottleKey: string) => void;
}

const Hero: React.FC<HeroProps> = ({
  isMobile,
  currentBottleIndex,
  setCurrentBottleIndex,
  hoveredBottle,
  setHoveredBottle,
  playBottleSound,
  scrollToProduct
}) => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const nextBottle = () => {
    const nextIndex = (currentBottleIndex + 1) % bottles.length;
    setCurrentBottleIndex(nextIndex);
  };

  const prevBottle = () => {
    const prevIndex = (currentBottleIndex - 1 + bottles.length) % bottles.length;
    setCurrentBottleIndex(prevIndex);
  };

  const bubbles = Array.from({ length: 150 }, (_, i) => ({
    delay: i * 0.2,
    size: 6 + Math.random() * 28,
    x: Math.random() * window.innerWidth,
  }));

  const handleBottleClick = () => {
    const bottleKey = bottles[currentBottleIndex].key;
    playBottleSound(bottleKey); // Play sound on click
    scrollToProduct(bottleKey); // Scroll to product section
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBottleClick();
    }
  };

  return (
    <header className="relative h-[calc(100vh-25px)] flex flex-col items-center justify-center overflow-hidden">
      {/* Sunburst background (toggled by bottle-cap click) */}
      <Sunburst />

      {/* Animated Bubbles and Rolling Bottle Cap */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[5]">
        {bubbles.map((bubble, i) => (
          <Bubble key={i} {...bubble} />
        ))}
      </div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-20">
        <RollingBottleCap />
      </div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col justify-between h-full">
        <div className="pt-20 md:pt-20 flex-none md:flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-2 md:mb-8"
          >
            <motion.h1
              animate={{
                x: hoveredBottle
                  ? (bottles.findIndex(b => b.key === hoveredBottle) - (bottles.length - 1) / 2) * 280
                  : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="text-xl md:text-3xl font-normal"
              style={{ color: '#cb2626', fontSize: undefined, lineHeight: undefined }}
            >
              {hoveredBottle ? t('products', 'bottles', hoveredBottle as keyof typeof t.products.bottles).name : t('hero', 'title')}
            </motion.h1>
          </motion.div>
        </div>

        {/* Mobile Bottle Slider */}
        {isMobile ? (
          <div className="flex flex-col items-center justify-center pb-4 flex-1">
            <div className="relative w-full max-w-[300px] h-full mx-auto overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 40 }, (_, i) => {
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBottleIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img 
                    src={bottles[currentBottleIndex].heroImage} 
                    alt={t('products', 'bottles', bottles[currentBottleIndex].key as keyof typeof t.products.bottles).name}
                    className="h-full object-contain cursor-pointer"
                    onClick={handleBottleClick}
                    onKeyDown={handleKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${t('products', 'bottles', bottles[currentBottleIndex].key as keyof typeof t.products.bottles).name} details`}
                  />
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevBottle}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center pointer-events-auto ml-2"
                  aria-label="Previous bottle"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextBottle}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center pointer-events-auto mr-2"
                  aria-label="Next bottle"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-center"
            >
              <h1 className="text-xl font-medium" style={{ color: '#cb2626', fontSize: '1.25rem', lineHeight: '1.75rem' }}>
                {t('products', 'bottles', bottles[currentBottleIndex].key as keyof typeof t.products.bottles).name}
              </h1>
            </motion.div>
            
            <div className="flex justify-center gap-2 mt-4">
              {bottles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBottleIndex(index)}
                  className={`w-2 h-2 rounded-full ${currentBottleIndex === index ? 'bg-white' : 'bg-white/30'}`}
                  aria-label={`Go to bottle ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex justify-center items-end gap-1 md:gap-2 lg:gap-3 xl:gap-4 px-4 pb-8 md:pb-12">
            {bottles.map((bottle, index) => (
              <motion.div
                key={bottle.key}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ 
                  y: -20,
                  transition: { duration: 0.3 }
                }}
                onMouseEnter={() => setHoveredBottle(bottle.key)}
                onMouseLeave={() => setHoveredBottle(null)}
                onClick={() => {
                  playBottleSound(bottle.key);
                  scrollToProduct(bottle.key);
                }}
                className="relative cursor-pointer group"
              >
                <motion.div 
                  className="w-[90px] md:w-[180px] lg:w-[240px] xl:w-[280px] h-[240px] md:h-[450px] lg:h-[600px] xl:h-[700px] relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                >
                  <img 
                    src={bottle.heroImage} 
                    alt={t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                    className="absolute inset-0 w-full h-full object-contain"
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
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium"
                  style={{ color: '#cb2626', fontSize: '0.875rem', lineHeight: '1.25rem' }}
                >
                  {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                </motion.h1>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </header>
  );
};

export default Hero;