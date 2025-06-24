import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  toggleSound: () => void;
  initializeAudio: () => void;
  isInitialized: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on component mount but don't play yet
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/afrososabgsound.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.7; // Fixed volume
      audioRef.current.preload = 'auto';
      audioRef.current.load();

      audioRef.current.addEventListener('canplaythrough', () => {
        setIsInitialized(true);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', () => {
          setIsInitialized(true);
        });
      }
    };
  }, []);

  // Initialize audio on user interaction
  const initializeAudio = () => {
    if (audioRef.current && !isInitialized) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioRef.current?.pause();
            setIsInitialized(true);
          })
          .catch(error => {
            console.error('Audio initialization failed:', error);
            setIsInitialized(true);
          });
      }
    }
  };

  const toggleSound = () => {
    if (!isInitialized) {
      initializeAudio();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.volume = 0.7; // Fixed volume
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error('Audio playback failed:', error);
            });
        }
      }
    }
  };

  const value = {
    isPlaying,
    toggleSound,
    initializeAudio,
    isInitialized
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};