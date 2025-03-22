import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import Bubble from '../animations/Bubble';
import RadialGradient from '../animations/RadialGradient';
import RollingBottleCap from '../animations/RollingBottleCap'; // Import the new component
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
    playBottleSound(bottles[nextIndex].key);
    setCurrentBottleIndex(nextIndex);
  };

  const prevBottle = () => {
    const prevIndex = (currentBottleIndex - 1 + bottles.length) % bottles.length;
    playBottleSound(bottles[prevIndex].key);
    setCurrentBottleIndex(prevIndex);
  };

  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    delay: i * 2,
    size: 50 + Math.random() * 100,
    x: (i % 5) * (window.innerWidth / 5) + Math.random() * 100 - 50,
  }));

  const radialGradients = [
    { color: 'bg-purple-500/50', size: 1000, x: -300, y: -150, duration: 25, delay: 0, opacity: 0.6 },
    { color: 'bg-pink-500/50', size: 800, x: 400, y: 200, duration: 20, delay: 5, opacity: 0.5 },
    { color: 'bg-yellow-500/40', size: 700, x: -150, y: 300, duration: 30, delay: 10, opacity: 0.4 },
    { color: 'bg-blue-500/40', size: 900, x: 250, y: -250, duration: 22, delay: 7, opacity: 0.45 },
    { color: 'bg-green-500/30', size: 750, x: -350, y: 150, duration: 28, delay: 3, opacity: 0.35 },
    { color: 'bg-orange-500/40', size: 850, x: 300, y: 300, duration: 26, delay: 8, opacity: 0.4 },
    { color: 'bg-indigo-500/40', size: 950, x: -200, y: -300, duration: 24, delay: 12, opacity: 0.45 },
  ];

  return (
    <header className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black/40" />
      
      {/* Animated Bubbles and Rolling Bottle Cap */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-20">
        {bubbles.map((bubble, i) => (
          <Bubble key={i} {...bubble} />
        ))}
        <RollingBottleCap />
      </div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col justify-between h-full">
        <div className="pt-20 md:pt-20 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-5xl italic md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500 font-heading">
              {t('hero', 'title')}
            </h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-3xl font-light"
            >
              {hoveredBottle ? t('products', 'bottles', hoveredBottle as keyof typeof t.products.bottles).name : t('hero', 'subtitle')}
            </motion.p>
          </motion.div>
        </div>

        {/* Mobile Bottle Slider */}
        {isMobile ? (
          <div className="flex flex-col items-center justify-center pb-16">
            <div className="relative w-full max-w-[300px] h-[400px] mx-auto">
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
                    className="h-full object-contain"
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
              <p className="text-xl font-medium">
                {t('products', 'bottles', bottles[currentBottleIndex].key as keyof typeof t.products.bottles).name}
              </p>
            </motion.div>
            
            <div className="flex justify-center gap-2 mt-4">
              {bottles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    playBottleSound(bottles[index].key);
                    setCurrentBottleIndex(index);
                  }}
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
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.3 }
                }}
                onMouseEnter={() => {
                  setHoveredBottle(bottle.key);
                  playBottleSound(bottle.key);
                }}
                onMouseLeave={() => setHoveredBottle(null)}
                onClick={() => scrollToProduct(bottle.key)}
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium"
                >
                  {t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Radial Gradients */}
      {radialGradients.map((gradient, index) => (
        <RadialGradient key={index} {...gradient} />
      ))}
    </header>
  );
};

export default Hero;