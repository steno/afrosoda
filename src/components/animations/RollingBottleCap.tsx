import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useAudio } from '../../context/AudioContext';
import { useAnimationContext } from '../../context/AnimationContext';

interface RollingBottleCapProps {
  startDelay?: number;
}

const RollingBottleCap: React.FC<RollingBottleCapProps> = ({ startDelay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { toggleSound } = useAudio();
  const { toggleShowcaseHover } = useAnimationContext();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();
  
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

  const initialX = useMemo(() => {
    if (isMobile) return 0;
    const centered = window.innerWidth / 2 - bottleCapWidth / 2;
    return Math.min(rightBound, Math.max(leftBound, centered));
  }, [bottleCapWidth, isMobile, leftBound, rightBound]);

  const xTarget = useMotionValue(initialX);
  const x = useSpring(xTarget, prefersReducedMotion ? { stiffness: 1000, damping: 200 } : { stiffness: 260, damping: 30 });
  const rotate = useTransform(x, [leftBound, rightBound], [-360, 360]);

  useEffect(() => {
    if (isMobile) return;

    // Ensure we don't animate from a stale width after resizes.
    xTarget.set(initialX);

    let raf = 0;
    let lastClientX = 0;
    let started = false;

    const update = () => {
      raf = 0;
      const desired = Math.min(rightBound, Math.max(leftBound, lastClientX - bottleCapWidth / 2));
      xTarget.set(desired);
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastClientX = e.clientX;
      if (!started) {
        started = true;
        if (startDelay > 0) {
          window.setTimeout(() => {
            if (!raf) raf = window.requestAnimationFrame(update);
          }, startDelay * 1000);
          return;
        }
      }
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [bottleCapWidth, initialX, isMobile, leftBound, rightBound, startDelay, xTarget]);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovering(false);
  };

  const handleClick = () => {
    toggleSound();
    toggleShowcaseHover();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    sound.current.currentTime = 0;
    sound.current.play().catch(error => console.error('Error playing sound:', error));
    if (!isMobile) {
      setIsHovering(true);
      timeoutRef.current = setTimeout(() => {
        setIsHovering(false);
      }, 2000);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={
        isMobile
          ? 'absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32'
          : 'absolute -bottom-10 w-32 h-32'
      }
      style={{
        zIndex: 1001,
        pointerEvents: 'auto',
        opacity: 1,
        x: isMobile ? undefined : x,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleClick}
        className="relative z-[2] block h-full w-full touch-manipulation border-0 bg-transparent p-0 cursor-pointer [-webkit-tap-highlight-color:transparent] appearance-none active:opacity-90"
        aria-label="Toggle background music"
      >
        <motion.span
          style={{ rotate: isMobile ? 0 : rotate }}
          className="pointer-events-none block h-full w-full"
        >
          <img
            src="https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/game-cork.png"
            alt=""
            className="h-full w-full"
            draggable={false}
          />
        </motion.span>
      </button>
      <AnimatePresence>
        {isHovering && !isMobile && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute -top-10 left-1/2 z-[1] -translate-x-1/2 bg-black/90 px-3 py-1.5 text-sm whitespace-nowrap text-white rounded-lg"
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