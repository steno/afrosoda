import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const AudioControls: React.FC = () => {
  const { isPlaying, toggleSound } = useAudio();

  return (
    <div className="fixed top-32 md:top-28 right-8 z-50 flex items-center text-white">
      <button
        type="button"
        onClick={toggleSound}
        className={`w-12 h-12 min-h-[48px] min-w-[48px] touch-manipulation bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black/30 active:scale-95 transition-[transform,colors,box-shadow] focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer [-webkit-tap-highlight-color:transparent] ${isPlaying ? 'ring-2 ring-white/40' : ''}`}
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default AudioControls;
