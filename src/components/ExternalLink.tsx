import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ExternalLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, className = '', children, ariaLabel }) => {
  const { language } = useLanguage();
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipId = React.useId();
  const linkRef = React.useRef<HTMLAnchorElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const tooltipText = language === 'en' ? 'Opens in new tab' : 'Öffnet in neuem Tab';

  return (
    <div className="relative inline-flex">
      <motion.a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        onKeyDown={handleKeyDown}
        aria-describedby={tooltipId}
        aria-label={ariaLabel || tooltipText}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center gap-2">
          {children}
          <ExternalLinkIcon 
            className="w-4 h-4" 
            aria-hidden="true"
          />
        </span>
      </motion.a>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap z-50"
          >
            {tooltipText}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black/90" 
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExternalLink;