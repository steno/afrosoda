import { useRef, useCallback } from 'react';

/** One lazy `Audio` per component; restart on enter, pause on leave. */
export function useSodaFizzHover(soundUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playFizz = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = 0.98;
    }
    audioRef.current.currentTime = 0;
    void audioRef.current.play().catch(() => {});
  }, [soundUrl]);

  const stopFizz = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { playFizz, stopFizz };
}
