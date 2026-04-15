import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useAnimationContext } from '../../context/AnimationContext';
import { useAudio } from '../../context/AudioContext';

const RollingBottleCap: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<'left' | 'right'>(Math.random() > 0.5 ? 'left' : 'right');
  const { toggleAnimations } = useAnimationContext();
  const { toggleSound } = useAudio();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Create Audio object
  const sound = useRef(new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/bottleopening.mp3'));

  // Update viewport width on resize
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bottle cap width (matches w-32 = 128px in Tailwind)
  const bottleCapWidth = 128;

  // Calculate animation boundaries (keep bottle cap fully visible)
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

  // Manage animation loop
  useEffect(() => {
    let isMounted = true;

    const animate = async () => {
      if (!isMounted || isHovering) return;
      await controls.start('animate');
      setDirection(prev => (prev === 'left' ? 'right' : 'left'));
      if (isMounted && !isHovering) {
        animate();
      }
    };

    const initialDelay = Math.random() * 2;
    const initialTimeout = setTimeout(animate, initialDelay * 1000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      controls.stop();
    };
  }, [controls, direction, isHovering]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
    controls.stop();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = () => {
    toggleAnimations();
    toggleSound();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    sound.current.play().catch(error => console.error('Error playing sound:', error));
    setIsHovering(true);
    controls.stop();
    timeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 2000);
  };

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={wrapperVariants}
      initial="initial"
      animate={controls}
      className="absolute -bottom-10 w-32 h-32 cursor-pointer"
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
        variants={imageVariants}
        initial="initial"
        animate={controls}
        className="w-full h-full"
      >
        <img
          src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/game-cork.png"
          alt="Rolling Bottle Cap"
          className="w-full h-full"
        />
      </motion.div>
      <AnimatePresence>
        {isHovering && (
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