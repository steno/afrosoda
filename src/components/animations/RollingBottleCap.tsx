import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../context/AudioContext';

interface RollingBottleCapProps {
  startDelay?: number;
}

const RollingBottleCap: React.FC<RollingBottleCapProps> = ({ startDelay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<'left' | 'right'>(Math.random() > 0.5 ? 'left' : 'right');
  const { toggleSound } = useAudio();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const sound = useRef(new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/bottleopening.mp3'));

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bottleCapWidth = 128;

  const leftBound = 0;
  const rightBound = viewportWidth - bottleCapWidth;

  const wrapperVariants = {
    animate: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? leftBound : rightBound,
      transition: { x: { duration: 5, ease: 'linear' } },
    }),
    initial: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? rightBound : leftBound,
    }),
  };

  const imageVariants = {
    animate: (dir: 'left' | 'right') => ({
      rotate: dir === 'left' ? -1080 : 1080,
      transition: { rotate: { duration: 5, ease: 'linear' } },
    }),
    initial: () => ({
      rotate: 0,
    }),
  };

  useEffect(() => {
    if (isMobile) return;

    let isMounted = true;

    const animate = async () => {
      if (!isMounted || isHovering) return;
      await controls.start('animate');
      setDirection(prev => (prev === 'left' ? 'right' : 'left'));
      if (isMounted && !isHovering) {
        animate();
      }
    };

    const initialTimeout = setTimeout(animate, startDelay * 1000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      controls.stop();
    };
  }, [controls, direction, isHovering, startDelay, isMobile]);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
    controls.stop();
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovering(false);
  };

  const handleClick = () => {
    toggleSound();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    sound.current.currentTime = 0;
    sound.current.play().catch(error => console.error('Error playing sound:', error));
    if (!isMobile) {
      setIsHovering(true);
      controls.stop();
      timeoutRef.current = setTimeout(() => {
        setIsHovering(false);
      }, 2000);
    }
  };

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={isMobile ? undefined : wrapperVariants}
      initial={isMobile ? undefined : 'initial'}
      animate={isMobile ? undefined : controls}
      className={
        isMobile
          ? 'absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 cursor-pointer'
          : 'absolute -bottom-10 w-32 h-32 cursor-pointer'
      }
      style={{
        zIndex: 1001,
        pointerEvents: 'auto',
        opacity: 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        custom={direction}
        variants={isMobile ? undefined : imageVariants}
        initial={isMobile ? undefined : 'initial'}
        animate={isMobile ? undefined : controls}
        className="w-full h-full"
      >
        <img
          src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/game-cork.png"
          alt="Rolling Bottle Cap"
          className="w-full h-full"
        />
      </motion.div>
      <AnimatePresence>
        {isHovering && !isMobile && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap z-50"
          >
            Toggle the Beat
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black/90"
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RollingBottleCap;