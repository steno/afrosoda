import React, { createContext, useState, useContext, useRef, useCallback, ReactNode } from 'react';

interface AnimationContextType {
  isAnimationEnabled: boolean;
  toggleAnimations: () => void;
  registerSunburstReplay: (fn: (reveal: boolean) => void) => void;
  replaySunburst: (reveal: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType>({
  isAnimationEnabled: true,
  toggleAnimations: () => {},
  registerSunburstReplay: () => {},
  replaySunburst: () => {},
});

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  const sunburstReplayRef = useRef<((reveal: boolean) => void) | null>(null);

  const toggleAnimations = () => {
    setIsAnimationEnabled(prev => !prev);
  };

  const registerSunburstReplay = useCallback((fn: (reveal: boolean) => void) => {
    sunburstReplayRef.current = fn;
  }, []);

  const replaySunburst = useCallback((reveal: boolean) => {
    sunburstReplayRef.current?.(reveal);
  }, []);

  return (
    <AnimationContext.Provider value={{ isAnimationEnabled, toggleAnimations, registerSunburstReplay, replaySunburst }}>
      {children}
    </AnimationContext.Provider>
  );
};

// Custom hook to use animation context
export const useAnimationContext = () => useContext(AnimationContext);

export default AnimationContext;