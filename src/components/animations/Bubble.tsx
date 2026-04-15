import React, { useMemo } from 'react';
import { useAnimationContext } from '../../context/AnimationContext';

interface BubbleProps {
  delay?: number;
  size?: number;
  x?: number;
}

const Bubble: React.FC<BubbleProps> = ({ delay = 0, size = 30, x = 0 }) => {
  const { isAnimationEnabled } = useAnimationContext();

  const style = useMemo(() => {
    const startY = Math.random() * 100;
    const drift = 30 + Math.random() * 40;
    const duration = 12 + Math.random() * 10;
    return {
      width: size,
      height: size,
      left: x,
      top: `${startY}vh`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      '--drift': `${drift}px`,
    } as React.CSSProperties;
  }, [delay, size, x]);

  if (!isAnimationEnabled) return null;

  return (
    <div
      className="absolute rounded-full bg-white/10 pointer-events-none will-change-transform bubble-rise"
      style={style}
    />
  );
};

export default Bubble;
