import React, { useEffect, useCallback } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useAnimationContext } from '../../context/AnimationContext';

const RAY_COUNT = 36;
const RAY_COLORS = ['#ffcc00', '#f5821f'];

function buildConicStops(): string {
  const sliceDeg = 360 / RAY_COUNT;
  return Array.from({ length: RAY_COUNT }, (_, i) => {
    const color = RAY_COLORS[i % 2];
    const start = i * sliceDeg;
    const end = start + sliceDeg;
    return `${color} ${start}deg ${end}deg`;
  }).join(', ');
}

const conicGradient = `conic-gradient(from 180deg at 50% 100%, ${buildConicStops()})`;

const Sunburst: React.FC = () => {
  const controls = useAnimationControls();
  const { registerSunburstReplay } = useAnimationContext();

  const replay = useCallback((reveal: boolean) => {
    if (reveal) {
      controls.stop();
      controls.set({ clipPath: 'circle(0% at 50% 100%)' });
      requestAnimationFrame(() => {
        controls.start({
          clipPath: 'circle(150% at 50% 100%)',
          transition: { clipPath: { duration: 5.4, ease: 'easeOut' } },
        });
      });
    } else {
      controls.start({
        clipPath: 'circle(0% at 50% 100%)',
        transition: { clipPath: { duration: 1.5, ease: 'easeIn' } },
      });
    }
  }, [controls]);

  useEffect(() => {
    registerSunburstReplay(replay);
  }, [registerSunburstReplay, replay]);

  useEffect(() => {
    controls.start({
      clipPath: 'circle(150% at 50% 100%)',
      transition: {
        clipPath: { duration: 5.4, ease: 'easeOut' },
      },
    });
  }, [controls]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 6 }}
    >
      {/* Rays — radial reveal then continuous rotation */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: conicGradient,
          transformOrigin: '50% 100%',
          scale: 1.6,
        }}
        initial={{
          clipPath: 'circle(0% at 50% 100%)',
          rotate: 0,
        }}
        animate={controls}
      />

      {/* Top glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 240% 120% at 50% 0%, rgba(255,204,0,1) 0%, rgba(255,204,0,0.6) 25%, rgba(245,130,31,0.3) 50%, transparent 75%)',
        }}
      />

      {/* Bottom glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,204,0,0.85) 0%, rgba(245,130,31,0.35) 40%, transparent 70%)',
        }}
      />

      {/* Halftone dot overlay */}
      <div
        className="absolute inset-0 sunburst-halftone"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
};

export default Sunburst;
