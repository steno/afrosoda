import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const AudioControls: React.FC = () => {
  const { 
    isPlaying, 
    volume, 
    toggleSound, 
    setVolume, 
    isVolumeVisible, 
    setIsVolumeVisible,
    initializeAudio,
    isInitialized
  } = useAudio();
  
  // Local state to track if we're currently dragging the volume slider
  const [isDragging, setIsDragging] = useState(false);
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile and initialize audio
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Try to initialize audio on first render
    const handleInitialTouch = () => {
      if (!isInitialized) {
        initializeAudio();
        
        // On mobile, auto-play background music after initialization
        if (window.innerWidth < 768) {
          setTimeout(() => {
            toggleSound();
          }, 1000);
        }
      }
      document.removeEventListener('touchstart', handleInitialTouch);
    };

    document.addEventListener('touchstart', handleInitialTouch);
    
    return () => {
      document.removeEventListener('touchstart', handleInitialTouch);
      window.removeEventListener('resize', checkMobile);
    };
  }, [initializeAudio, isInitialized, toggleSound]);

  // Handle touch start on volume slider
  const handleTouchStart = () => {
    setIsVolumeVisible(true);
    setIsDragging(true);
  };

  // Handle touch end on volume slider
  const handleTouchEnd = () => {
    setIsDragging(false);
    // Don't hide volume immediately to allow user to see final value
    setTimeout(() => {
      if (!isDragging) {
        setIsVolumeVisible(false);
      }
    }, 2500);
  };

  // If we're on mobile, don't render the audio controls
  if (isMobile) {
    return null;
  }

  return (
    <div 
      className="fixed top-24 md:top-28 right-8 z-10 flex items-center text-white"
      onMouseEnter={() => setIsVolumeVisible(true)}
      onMouseLeave={() => {
        if (!isDragging) {
          setIsVolumeVisible(false);
        }
      }}
    >
      <AnimatePresence>
        {isVolumeVisible && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="mr-2 bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden"
          >
            <div className="flex items-center px-3 h-10">
              <Volume2 className="w-4 h-4 mr-2" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVolume = Number(e.target.value);
                  setVolume(newVolume);
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="w-24"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSound}
        className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black/30 transition-colors"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </motion.button>
    </div>
  );
};

export default AudioControls;