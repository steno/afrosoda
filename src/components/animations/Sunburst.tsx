import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useAnimationContext } from '../../context/AnimationContext';

const RAY_COLORS = ['#ffcc00', '#f5821f'];

function buildConicStops(rayCount: number): string {
  const sliceDeg = 360 / rayCount;
  return Array.from({ length: rayCount }, (_, i) => {
    const color = RAY_COLORS[i % 2];
    const start = i * sliceDeg;
    const end = start + sliceDeg;
    return `${color} ${start}deg ${end}deg`;
  }).join(', ');
}

const Sunburst: React.FC = () => {
  const controls = useAnimationControls();
  const { registerSunburstReplay, isAnimationEnabled } = useAnimationContext();
  const [rayCount, setRayCount] = useState(36);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setRayCount(mq.matches ? 14 : 36);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const conicGradient = useMemo(
    () => `conic-gradient(from 180deg at 50% 100%, ${buildConicStops(rayCount)})`,
    [rayCount]
  );

  const replay = useCallback(
    (reveal: boolean) => {
      if (!isAnimationEnabled) {
        controls.set({ clipPath: reveal ? 'circle(150% at 50% 100%)' : 'circle(0% at 50% 100%)' });
        return;
      }
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
    },
    [controls, isAnimationEnabled]
  );

  useEffect(() => {
    registerSunburstReplay(replay);
  }, [registerSunburstReplay, replay]);

  useEffect(() => {
    if (!isAnimationEnabled) {
      controls.set({ clipPath: 'circle(150% at 50% 100%)' });
      return;
    }
    controls.start({
      clipPath: 'circle(150% at 50% 100%)',
      transition: {
        clipPath: { duration: 5.4, ease: 'easeOut', delay: 0.3 },
      },
    });
  }, [controls, isAnimationEnabled]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 6 }}
    >
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

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 240% 120% at 50% 0%, rgba(255,204,0,1) 0%, rgba(255,204,0,0.6) 25%, rgba(245,130,31,0.3) 50%, transparent 75%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 240% 180% at 50% 100%, rgba(255,204,0,0.85) 0%, rgba(245,130,31,0.35) 40%, transparent 70%)',
        }}
      />

      {/* Halftone + multiply is expensive on low-end GPUs; show from md up */}
      <div
        className="absolute inset-0 sunburst-halftone hidden md:block"
        style={{
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
};

export default Sunburst;
