import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const RollingBottleCap: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<'left' | 'right'>(Math.random() > 0.5 ? 'left' : 'right');
  const [isMounted, setIsMounted] = useState(false);

  const variants = {
    animate: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? '-130px' : '130vw',
      rotate: dir === 'left' ? -1080 : 1080,
      transition: {
        duration: 5,
        ease: 'linear',
        repeat: 0,
      },
    }),
    initial: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? '130vw' : '-130px',
      rotate: 0,
    }),
  };

  // Initial animation loop
  useEffect(() => {
    setIsMounted(true); // Mark as mounted
    const startAnimation = async () => {
      if (!isMounted || !ref.current) return; // Safety check
      await controls.start('animate');
      const delay = Math.random() * 10 + 5;
      setTimeout(() => {
        setDirection(Math.random() > 0.5 ? 'left' : 'right');
        startAnimation();
      }, delay * 1000);
    };

    const initialDelay = Math.random() * 5;
    const timer = setTimeout(startAnimation, initialDelay * 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      controls.stop();
      setIsMounted(false);
    };
  }, [controls, isMounted]); // Depend on controls and isMounted

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!ref.current) return;
    controls.stop();
    console.log('Mouse entered');

    const capRect = ref.current.getBoundingClientRect();
    const capCenterX = capRect.left + capRect.width / 2;
    const mouseX = e.clientX;

    // If mouse is left of cap center, roll right; if right, roll left
    const newDirection = mouseX < capCenterX ? 'right' : 'left';
    setDirection(newDirection);
  };

  const handleMouseLeave = () => {
    if (!isMounted || !ref.current) return; // Ensure mounted before starting
    console.log('Mouse left');
    controls.start('animate');
  };

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={variants}
      initial="initial"
      animate={controls}
      className="absolute bottom-10 w-32 h-32"
      style={{ 
        zIndex: 1001,
        pointerEvents: 'auto',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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