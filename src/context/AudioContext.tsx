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
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const TARGET_VOLUME = 0.7;
  const FADE_DURATION = 800;
  const FADE_STEP_MS = 30;

  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeIn = (audio: HTMLAudioElement) => {
    clearFade();
    audio.volume = 0;
    const steps = FADE_DURATION / FADE_STEP_MS;
    const volumeStep = TARGET_VOLUME / steps;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          fadeIntervalRef.current = setInterval(() => {
            if (audio.volume + volumeStep >= TARGET_VOLUME) {
              audio.volume = TARGET_VOLUME;
              clearFade();
            } else {
              audio.volume = Math.min(audio.volume + volumeStep, TARGET_VOLUME);
            }
          }, FADE_STEP_MS);
        })
        .catch(error => {
          console.error('Audio playback failed:', error);
        });
    }
  };

  const fadeOut = (audio: HTMLAudioElement) => {
    clearFade();
    const startVolume = audio.volume;
    const steps = FADE_DURATION / FADE_STEP_MS;
    const volumeStep = startVolume / steps;

    setIsPlaying(false);
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume - volumeStep <= 0) {
        audio.volume = 0;
        audio.pause();
        clearFade();
      } else {
        audio.volume = Math.max(audio.volume - volumeStep, 0);
      }
    }, FADE_STEP_MS);
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/afrososabgsound.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
      audioRef.current.preload = 'auto';
      audioRef.current.load();

      audioRef.current.addEventListener('canplaythrough', () => {
        setIsInitialized(true);
      });
    }

    return () => {
      clearFade();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', () => {
          setIsInitialized(true);
        });
      }
    };
  }, []);

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
        fadeOut(audioRef.current);
      } else {
        fadeIn(audioRef.current);
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