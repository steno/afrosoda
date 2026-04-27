import React, { useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
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
  const { t } = useTranslation();
  const initialMount = useRef(true);
  /** 1 = next (enter from right, exit left); -1 = prev (enter from left, exit right). */
  const mobileSlideDirRef = useRef<1 | -1>(1);
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
    mobileSlideDirRef.current = 1;
    const nextIndex = (currentBottleIndex + 1) % bottles.length;
    setCurrentBottleIndex(nextIndex);
  };

  const prevBottle = () => {
    initialMount.current = false;
    mobileSlideDirRef.current = -1;
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
      
      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col justify-between px-4 pb-3 md:max-w-none md:px-6 md:pb-0 lg:px-10 lg:pb-1 xl:px-14">
        <div className="flex shrink-0 flex-col justify-start pt-20 md:mx-auto md:max-w-4xl md:w-full md:pt-20">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-20 mt-2 text-center md:mt-4"
          >
            <motion.h1
              className="mx-auto max-w-[90vw] text-xl md:text-3xl font-normal"
              style={{ color: '#cb2626' }}
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
                    initial={
                      initialMount.current
                        ? { opacity: 0, x: 0 }
                        : { opacity: 0, x: mobileSlideDirRef.current === 1 ? '100%' : '-100%' }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: initialMount.current ? 0.5 : 0.3,
                        delay: initialMount.current ? 2 : 0,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      x: mobileSlideDirRef.current === 1 ? '-100%' : '100%',
                      transition: { duration: 0.22 },
                    }}
                    onAnimationComplete={() => {
                      initialMount.current = false;
                    }}
                    className="absolute inset-0 flex items-center justify-center px-1"
                  >
                    <img 
                      src={bottles[currentBottleIndex].heroImage} 
                      alt={t('products', 'bottles', bottles[currentBottleIndex].key as keyof typeof t.products.bottles).name}
                      width={450}
                      height={1400}
                      decoding="async"
                      className="max-h-full w-auto max-w-full object-contain object-bottom cursor-pointer"
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
          <div className="hidden min-h-0 w-full flex-1 flex-col justify-end pb-0 md:flex md:pb-1 lg:pb-2">
            <div
              className="flex min-h-0 w-full flex-1 items-stretch justify-between gap-2 pt-0 md:gap-4 lg:gap-6 xl:gap-10 2xl:gap-12"
            >
            {bottles.map((bottle, index) => (
              <motion.div
                key={bottle.key}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: isHeroBottleAnimationEnabled ? -12 : 0, opacity: 1 }}
                transition={{ delay: 2 + index * 0.2, duration: 0.8 }}
                whileHover={{ 
                  y: -12,
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
                className="group relative flex min-h-0 min-w-0 flex-1 cursor-pointer flex-col justify-end"
              >
                <motion.div 
                  className="relative mx-auto flex h-full min-h-0 w-full items-end justify-center overflow-hidden"
                  whileHover={{ scale: 1.08 }}
                  animate={{ scale: isHeroBottleAnimationEnabled ? 1.08 : 1 }}
                >
                  <img 
                    src={bottle.heroImage} 
                    alt={t('products', 'bottles', bottle.key as keyof typeof t.products.bottles).name}
                    width={450}
                    height={1400}
                    decoding="async"
                    className="block h-auto max-h-full w-auto max-w-full object-contain object-bottom select-none"
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
              </motion.div>
            ))}
            </div>
          </div>
        )}
      </div>

    </header>
  );
};

export default Hero;