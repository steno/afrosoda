import React, { useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { useAnimationContext } from '../../context/AnimationContext';
import Bubble from '../animations/Bubble';
import RollingBottleCap from '../animations/RollingBottleCap';
import Sunburst from '../animations/Sunburst';
import { bottles, SODA_FIZZ_SOUND_URL } from '../../data/bottles';
import { useSodaFizzHover } from '../../hooks/useSodaFizzHover';

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
  const initialMount = useRef(true);
  const { playFizz, stopFizz } = useSodaFizzHover(SODA_FIZZ_SOUND_URL);
  const { isHeroBottleAnimationEnabled } = useAnimationContext();

  const bubbleConfigs = useMemo(() => {
    const count = isMobile ? 28 : 72;
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return Array.from({ length: count }, (_, i) => ({
      delay: i * (isMobile ? 0.4 : 0.22),
      size: 6 + Math.random() * (isMobile ? 16 : 28),
      x: Math.random() * width,
    }));
  }, [isMobile]);

  const nextBottle = () => {
    initialMount.current = false;
    const nextIndex = (currentBottleIndex + 1) % bottles.length;
    setCurrentBottleIndex(nextIndex);
  };

  const prevBottle = () => {
    initialMount.current = false;
    const prevIndex = (currentBottleIndex - 1 + bottles.length) % bottles.length;
    setCurrentBottleIndex(prevIndex);
  };

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchLastRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY };
    touchLastRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchLastRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(() => {
    const start = touchStartRef.current;
    const last = touchLastRef.current;
    touchStartRef.current = null;
    touchLastRef.current = null;
    if (!start || !last) return;

    const dx = last.x - start.x;
    const dy = last.y - start.y;

    // Guard against accidental horizontal swipes during vertical scrolling.
    if (Math.abs(dy) > Math.abs(dx)) return;

    const SWIPE_THRESHOLD_PX = 40;
    if (dx <= -SWIPE_THRESHOLD_PX) nextBottle();
    if (dx >= SWIPE_THRESHOLD_PX) prevBottle();
  }, [nextBottle, prevBottle]);

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
        {bubbleConfigs.map((bubble, i) => (
          <Bubble key={i} {...bubble} />
        ))}
      </div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-20">
        <RollingBottleCap startDelay={2 + (bottles.length - 1) * 0.2 + 0.8} />
      </div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col justify-between h-full">
        <div className="pt-20 md:pt-20 flex-none md:flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center mt-2 md:mt-16"
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
              {isMobile
                ? t('products', 'bottles', bottles[currentBottleIndex].key as keyof typeof t.products.bottles).name
                : hoveredBottle ? t('products', 'bottles', hoveredBottle as keyof typeof t.products.bottles).name : t('hero', 'title')}
            </motion.h1>
          </motion.div>
        </div>

        {/* Mobile Bottle Slider */}
        {isMobile ? (
          <div className="flex flex-col items-center justify-center pb-4 flex-1">
            <div className="relative w-full max-w-[300px] h-full mx-auto">
              <div
                className="absolute inset-0 overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'pan-y' }}
                aria-label="Swipe to change bottle"
              >
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 14 }, (_, i) => {
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
                    animate={{ opacity: 1, scale: 1, transition: { duration: initialMount.current ? 0.5 : 0.3, delay: initialMount.current ? 2 : 0 } }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    onAnimationComplete={() => { initialMount.current = false; }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <img 
                      src={bottles[currentBottleIndex].heroImage} 
                      alt={t('products', 'bottles', bottles[currentBottleIndex].key as keyof typeof t.products.bottles).name}
                      className="h-full object-contain cursor-pointer"
                      onClick={handleBottleClick}
                      onKeyDown={handleKeyDown}
                      onMouseEnter={playFizz}
                      onMouseLeave={stopFizz}
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${t('products', 'bottles', bottles[currentBottleIndex].key as keyof typeof t.products.bottles).name} details`}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="absolute inset-y-0 -left-8 -right-8 flex items-center justify-between pointer-events-none z-10">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={prevBottle}
                  className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center pointer-events-auto shadow-lg active:bg-black/60"
                  aria-label="Previous bottle"
                >
                  <ChevronLeft className="w-7 h-7 text-white" />
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={nextBottle}
                  className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center pointer-events-auto shadow-lg active:bg-black/60"
                  aria-label="Next bottle"
                >
                  <ChevronRight className="w-7 h-7 text-white" />
                </motion.button>
              </div>
            </div>
            
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
                animate={{ y: isHeroBottleAnimationEnabled ? -20 : 0, opacity: 1 }}
                transition={{ delay: 2 + index * 0.2, duration: 0.8 }}
                whileHover={{ 
                  y: -20,
                  transition: { duration: 0.3 }
                }}
                onMouseEnter={() => {
                  setHoveredBottle(bottle.key);
                  playFizz();
                }}
                onMouseLeave={() => {
                  setHoveredBottle(null);
                  stopFizz();
                }}
                onClick={() => {
                  playBottleSound(bottle.key);
                  scrollToProduct(bottle.key);
                }}
                className="relative cursor-pointer group"
              >
                <motion.div 
                  className="w-[90px] md:w-[180px] lg:w-[240px] xl:w-[280px] h-[240px] md:h-[450px] lg:h-[600px] xl:h-[700px] relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  animate={{ scale: isHeroBottleAnimationEnabled ? 1.1 : 1 }}
                >
                  <img 
                    src={bottle.heroImage} 
                    alt={t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                      isHeroBottleAnimationEnabled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
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
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  animate={isHeroBottleAnimationEnabled ? { opacity: 1, y: 0 } : undefined}
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