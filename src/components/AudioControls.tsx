import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useAnimationContext } from '../context/AnimationContext';

export type AudioControlsVariant = 'floating' | 'nav';

interface AudioControlsProps {
  variant?: AudioControlsVariant;
}

const AudioControls: React.FC<AudioControlsProps> = ({ variant = 'floating' }) => {
  const { isPlaying, toggleSound } = useAudio();
  const { toggleShowcaseHover, toggleHeroBottleAnimation } = useAnimationContext();
  const label = isPlaying ? 'Pause audio' : 'Play audio';
  const Icon = isPlaying ? Pause : Play;

  const handleClick = () => {
    toggleSound();
    toggleShowcaseHover();
    toggleHeroBottleAnimation();
  };

  if (variant === 'nav') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-0 bg-transparent p-0 transition-colors [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer ${
          isPlaying ? 'text-white' : 'text-white/70 hover:text-white'
        }`}
        aria-label={label}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </button>
    );
  }

  return (
    <div className="fixed top-32 md:top-28 right-8 z-50 flex items-center text-white">
      <button
        type="button"
        onClick={handleClick}
        className={`w-12 h-12 min-h-[48px] min-w-[48px] touch-manipulation bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black/30 active:scale-95 transition-[transform,colors,box-shadow] focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer [-webkit-tap-highlight-color:transparent] ${isPlaying ? 'ring-2 ring-white/40' : ''}`}
        aria-label={label}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default AudioControls;
