import { motion } from 'framer-motion';

interface RadialGradientProps {
  color: string;
  size?: number;
  x?: number;
  y?: number;
  duration?: number;
  delay?: number;
  opacity?: number;
}

const RadialGradient: React.FC<RadialGradientProps> = ({ 
  color, 
  size = 600, 
  x = 0, 
  y = 0, 
  duration = 20,
  delay = 0,
  opacity = 0.5
}) => (
  <motion.div
    initial={{ 
      opacity: 0,
      scale: 0.5,
      x: x,
      y: y
    }}
    animate={{ 
      opacity: [0, opacity, opacity * 0.7, opacity],
      scale: [0.5, 1.2, 1, 1.2],
      x: [x, x + 100, x - 50, x],
      y: [y, y - 50, y + 100, y]
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    className={`absolute rounded-full ${color} blur-3xl pointer-events-none`}
    style={{
      width: size,
      height: size,
    }}
  />
);

export default RadialGradient;