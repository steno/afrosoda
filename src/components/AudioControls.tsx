import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const AudioControls: React.FC = () => {
  const { isPlaying, toggleSound } = useAudio();

  return (
    <div className="fixed top-32 md:top-28 right-8 z-50 flex items-center text-white">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isPlaying ? { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] } : { scale: 1 }}
        transition={isPlaying ? { repeat: Infinity, duration: 1.5 } : {}}
        onClick={toggleSound}
        className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-black/30 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </motion.button>
    </div>
  );
};

export default AudioControls;