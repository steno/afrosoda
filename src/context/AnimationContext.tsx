import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the animation context
interface AnimationContextType {
  isAnimationEnabled: boolean;
  toggleAnimations: () => void;
}

// Create the context with a default value
const AnimationContext = createContext<AnimationContextType>({
  isAnimationEnabled: false, // Changed to false to match initial state
  toggleAnimations: () => {}
});

// Provider component to wrap the entire app
export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false); // Changed to false

  const toggleAnimations = () => {
    setIsAnimationEnabled(prev => !prev);
  };

  return (
    <AnimationContext.Provider value={{ isAnimationEnabled, toggleAnimations }}>
      {children}
    </AnimationContext.Provider>
  );
};

// Custom hook to use animation context
export const useAnimationContext = () => useContext(AnimationContext);

export default AnimationContext;