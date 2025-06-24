import React from 'react';
import { motion } from 'framer-motion';
import { useAnimationContext } from '../../context/AnimationContext';

interface BubbleProps {
  delay?: number;
  size?: number;
  x?: number;
}

const Bubble: React.FC<BubbleProps> = ({ delay = 0, size = 100, x = 0 }) => {
  const { isAnimationEnabled } = useAnimationContext();
  
  // Generate a random starting vertical position (between 0 and 100vh)
  const randomStartY = Math.random() * 100;

  if (!isAnimationEnabled) {
    return null;
  }

  return (
    <motion.div
      initial={{ 
        y: `${randomStartY}vh`, 
        opacity: 0.7,
        x: x
      }}
      animate={isAnimationEnabled ? {
        y: '-100vh',
        opacity: [0.7, 0.9, 0.7],
        x: [x, x + 50, x],
      } : {}}
      transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
        x: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }
      }}
      className="absolute rounded-full bg-white/10 backdrop-blur-sm pointer-events-none"
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default Bubble;