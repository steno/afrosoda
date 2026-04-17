import React, { createContext, useState, useContext, useRef, useCallback, useEffect, ReactNode } from 'react';

interface AnimationContextType {
  isAnimationEnabled: boolean;
  toggleAnimations: () => void;
  isShowcaseHoverEnabled: boolean;
  toggleShowcaseHover: () => void;
  registerSunburstReplay: (fn: (reveal: boolean) => void) => void;
  replaySunburst: (reveal: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType>({
  isAnimationEnabled: true,
  toggleAnimations: () => {},
  isShowcaseHoverEnabled: false,
  toggleShowcaseHover: () => {},
  registerSunburstReplay: () => {},
  replaySunburst: () => {},
});

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(() => !getPrefersReducedMotion());
  const [isShowcaseHoverEnabled, setIsShowcaseHoverEnabled] = useState(false);
  const sunburstReplayRef = useRef<((reveal: boolean) => void) | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setIsAnimationEnabled(!mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleAnimations = () => {
    setIsAnimationEnabled(prev => !prev);
  };

  const toggleShowcaseHover = () => {
    setIsShowcaseHoverEnabled(prev => !prev);
  };

  const registerSunburstReplay = useCallback((fn: (reveal: boolean) => void) => {
    sunburstReplayRef.current = fn;
  }, []);

  const replaySunburst = useCallback((reveal: boolean) => {
    sunburstReplayRef.current?.(reveal);
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        isAnimationEnabled,
        toggleAnimations,
        isShowcaseHoverEnabled,
        toggleShowcaseHover,
        registerSunburstReplay,
        replaySunburst,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

// Custom hook to use animation context
export const useAnimationContext = () => useContext(AnimationContext);

export default AnimationContext;