import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  isVolumeVisible: boolean;
  setIsVolumeVisible: (visible: boolean) => void;
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
  const [volume, setVolume] = useState(0.7);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Initialize audio on component mount but don't play yet
  useEffect(() => {
    // Create audio element but don't play automatically
    if (!audioRef.current) {
      audioRef.current = new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/afrososabgsound.mp3');
      
      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
        audioRef.current.preload = 'auto';
        
        // Load the audio file
        audioRef.current.load();
        
        // Add event listener for when audio is loaded
        audioRef.current.addEventListener('canplaythrough', () => {
          setIsInitialized(true);
        });
      }
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', () => {
          setIsInitialized(true);
        });
      }
    };
  }, []);

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Function to initialize audio on user interaction
  const initializeAudio = () => {
    if (audioRef.current && !isInitialized) {
      // Create a user gesture context for mobile browsers
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Immediately pause after successful play to initialize audio context
            audioRef.current?.pause();
            setIsInitialized(true);
            
            // If on mobile, auto-play after a short delay
            if (isMobile) {
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.play()
                    .then(() => {
                      setIsPlaying(true);
                    })
                    .catch(err => console.error("Mobile autoplay failed:", err));
                }
              }, 500);
            }
          })
          .catch(error => {
            console.error('Audio initialization failed:', error);
            // Try to initialize without playing
            setIsInitialized(true);
          });
      }
    }
  };

  const toggleSound = () => {
    // Initialize audio if not already initialized
    if (!isInitialized) {
      initializeAudio();
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.volume = volume;
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error('Audio playback failed:', error);
              
              // On mobile, we might need to retry with user interaction
              if (isMobile) {
                // For mobile, we'll try to play again without showing an alert
                setTimeout(() => {
                  if (audioRef.current) {
                    audioRef.current.play()
                      .then(() => setIsPlaying(true))
                      .catch(() => console.error("Mobile retry failed"));
                  }
                }, 1000);
              }
            });
        }
      }
    }
  };

  const value = {
    isPlaying,
    volume,
    toggleSound,
    setVolume,
    isVolumeVisible,
    setIsVolumeVisible,
    initializeAudio,
    isInitialized
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};