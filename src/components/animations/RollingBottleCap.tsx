import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useAnimationContext } from '../../context/AnimationContext';

const RollingBottleCap: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<'left' | 'right'>(Math.random() > 0.5 ? 'left' : 'right');
  const { toggleAnimations } = useAnimationContext();
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

  const variants = {
    animate: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? leftBound : rightBound,
      rotate: dir === 'left' ? -1080 : 1080,
      transition: {
        x: {
          duration: 5,
          ease: 'linear',
        },
        rotate: {
          duration: 5,
          ease: 'linear',
        },
      },
    }),
    initial: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? rightBound : leftBound,
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Play sound
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
      variants={variants}
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
      <img
        src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/game-cork.png"
        alt="Rolling Bottle Cap"
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default RollingBottleCap;