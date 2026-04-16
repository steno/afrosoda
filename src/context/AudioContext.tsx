import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

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

/** Max gain only for the ambient loop in this provider — not bottle/SFX elsewhere. */
const TARGET_VOLUME = 0.35;
const FADE_DURATION = 800;
const FADE_STEP_MS = 30;

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(false);
  const isInitializedRef = useRef(false);
  const fadeInPendingRef = useRef(false);
  const fadeGenerationRef = useRef(0);

  const clearFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const syncPlayingFromElement = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !audio.paused;
    if (isPlayingRef.current !== next) {
      isPlayingRef.current = next;
      setIsPlaying(next);
    }
  }, []);

  const fadeIn = useCallback(
    (audio: HTMLAudioElement) => {
      clearFade();
      fadeGenerationRef.current += 1;
      const generation = fadeGenerationRef.current;
      fadeInPendingRef.current = true;
      audio.volume = 0;
      const steps = Math.max(1, Math.round(FADE_DURATION / FADE_STEP_MS));
      const volumeStep = TARGET_VOLUME / steps;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (generation !== fadeGenerationRef.current) return;
            fadeInPendingRef.current = false;
            isPlayingRef.current = true;
            setIsPlaying(true);
            fadeIntervalRef.current = setInterval(() => {
              if (generation !== fadeGenerationRef.current) return;
              if (audio.volume + volumeStep >= TARGET_VOLUME) {
                audio.volume = TARGET_VOLUME;
                clearFade();
              } else {
                audio.volume = Math.min(audio.volume + volumeStep, TARGET_VOLUME);
              }
            }, FADE_STEP_MS);
          })
          .catch(error => {
            if (generation === fadeGenerationRef.current) {
              fadeInPendingRef.current = false;
            }
            console.error('Audio playback failed:', error);
          });
      } else {
        fadeInPendingRef.current = false;
      }
    },
    [clearFade]
  );

  const stopPlaybackInUserGesture = useCallback(
    (audio: HTMLAudioElement) => {
      fadeGenerationRef.current += 1;
      fadeInPendingRef.current = false;
      clearFade();
      try {
        audio.pause();
        audio.volume = 0;
      } catch {
        /* ignore */
      }
      isPlayingRef.current = false;
      setIsPlaying(false);
    },
    [clearFade]
  );

  useEffect(() => {
    if (audioRef.current) return;

    const audio = new Audio(
      'https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/afrososabgsound.mp3'
    );
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    audio.setAttribute('playsinline', '');
    audio.load();
    audioRef.current = audio;

    const onPlay = () => {
      fadeInPendingRef.current = false;
      isPlayingRef.current = true;
      setIsPlaying(true);
    };
    const onPause = () => {
      fadeInPendingRef.current = false;
      isPlayingRef.current = false;
      setIsPlaying(false);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      clearFade();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audioRef.current = null;
    };
  }, [clearFade]);

  const initializeAudio = useCallback(() => {
    if (!audioRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;
    setIsInitialized(true);
  }, []);

  const toggleSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      setIsInitialized(true);
    }

    syncPlayingFromElement();

    const shouldStop = !audio.paused || fadeInPendingRef.current;

    if (shouldStop) {
      stopPlaybackInUserGesture(audio);
    } else {
      fadeIn(audio);
    }
  }, [fadeIn, stopPlaybackInUserGesture, syncPlayingFromElement]);

  const value = useMemo(
    () => ({
      isPlaying,
      toggleSound,
      initializeAudio,
      isInitialized,
    }),
    [isPlaying, toggleSound, initializeAudio, isInitialized]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
