import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from './hooks/useTranslation';
import { useLanguage } from './context/LanguageContext';
import { useAudio } from './context/AudioContext';
import BackToTop from './components/BackToTop';
import AudioControls from './components/AudioControls';
import Navigation from './components/layout/Navigation';
import Hero from './components/sections/Hero';
import ProductShowcase from './components/sections/ProductShowcase';
import CallToAction from './components/sections/CallToAction';
import Footer from './components/layout/Footer';
import { bottles } from './data/bottles';


function App() {
  const { language } = useLanguage();
  const [hoveredBottle, setHoveredBottle] = useState<string | null>(null);
  const [soundsInitialized, setSoundsInitialized] = useState(false);
  const { t } = useTranslation(language);
  const { volume, initializeAudio } = useAudio();
  const [isMobile, setIsMobile] = useState(false);
  const [currentBottleIndex, setCurrentBottleIndex] = useState(0);
  const [activeProductKey, setActiveProductKey] = useState<string | null>(null);
  
 


  // Create refs for bottle sounds
  const bottleSoundsRef = useRef<{ [key: string]: HTMLAudioElement | null }>({
    cosmicCola: null,
    goldenHibiscus: null,
    kinkyCocomut: null,
    magicMango: null,
    bubbleBanana: null
  });
  
  // Create refs for each product section
  const productSectionRef = useRef<HTMLElement>(null);
  const productRefs = useRef<{ [key: string]: HTMLDivElement | null }>({
    cosmicCola: null,
    goldenHibiscus: null,
    kinkyCocomut: null,
    magicMango: null,
    bubbleBanana: null
  });

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

  // Initialize bottle sounds on component mount
  useEffect(() => {
    if (!soundsInitialized) {
      // Create audio elements for each bottle
      bottleSoundsRef.current = {
        cosmicCola: new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/cowbell-sharp-hit-3.wav'),
        goldenHibiscus: new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/cowbell-sharp-hit-2.wav'),
        kinkyCocomut: new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/cowbell-sharp-hit-3.wav'),
        magicMango: new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/cowbell-sharp-hit-4.wav'),
        bubbleBanana: new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/cowbell-sharp-hit-3.wav')
      };
      
      // Preload all sounds
      Object.values(bottleSoundsRef.current).forEach(audio => {
        if (audio) {
          audio.volume = volume;
          audio.load();
        }
      });
      
      setSoundsInitialized(true);
    }
  }, [soundsInitialized, volume]);

  // Update sound volumes when main volume changes
  useEffect(() => {
    if (soundsInitialized) {
      Object.values(bottleSoundsRef.current).forEach(audio => {
        if (audio) {
          audio.volume = volume;
        }
      });
    }
  }, [volume, soundsInitialized]);

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      // Initialize audio context
      initializeAudio();
      
      // Also initialize bottle sounds
      if (!soundsInitialized) {
        // Try to play and immediately pause each sound to initialize audio context
        Object.values(bottleSoundsRef.current).forEach(audio => {
          if (audio) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  // Immediately pause after successful play
                  audio.pause();
                  audio.currentTime = 0;
                })
                .catch(error => {
                  console.error('Sound initialization failed:', error);
                });
            }
          }
        });
        
        setSoundsInitialized(true);
      }
      
      // Remove event listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [initializeAudio, soundsInitialized]);

  // Track scroll position to determine active product
  useEffect(() => {
    const handleScroll = () => {
      // Only run this if we have product refs
      if (Object.values(productRefs.current).some(ref => ref !== null)) {
        // Get all product elements with their positions
        const productPositions = Object.entries(productRefs.current)
          .filter(([_, ref]) => ref !== null)
          .map(([key, ref]) => {
            const rect = ref?.getBoundingClientRect();
            return {
              key,
              top: rect?.top || 0,
              bottom: rect?.bottom || 0,
              height: rect?.height || 0
            };
          });
        
        // Find the product that is most visible in the viewport
        const viewportHeight = window.innerHeight;
        let maxVisibleProduct = null;
        let maxVisibleArea = 0;
        
        for (const product of productPositions) {
          // Calculate how much of the product is visible
          const visibleTop = Math.max(0, product.top);
          const visibleBottom = Math.min(viewportHeight, product.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visiblePercentage = visibleHeight / product.height;
          
          if (visiblePercentage > maxVisibleArea) {
            maxVisibleArea = visiblePercentage;
            maxVisibleProduct = product.key;
          }
        }
        
        // Update active product if it changed
        if (maxVisibleProduct && maxVisibleProduct !== activeProductKey) {
          setActiveProductKey(maxVisibleProduct);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    setTimeout(handleScroll, 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeProductKey]);

  // Function to play a specific bottle sound
  const playBottleSound = (bottleKey: string) => {
    if (bottleSoundsRef.current[bottleKey] && soundsInitialized) {
      const audio = bottleSoundsRef.current[bottleKey];
      if (audio) {
        audio.volume = volume;
        audio.currentTime = 0;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error(`${bottleKey} sound playback failed:`, error);
          });
        }
      }
    }
  };

  // Function to scroll to top when clicking the logo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Function to scroll to a specific product section
  const scrollToProduct = (bottleKey: string) => {
    playBottleSound(bottleKey);
    
    // First scroll to the products section
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Then scroll to the specific product with a slight delay
    setTimeout(() => {
      if (productRefs.current[bottleKey]) {
        productRefs.current[bottleKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  };

  // Get the current active bottle's gradient
  const getActiveGradient = () => {
    if (!activeProductKey) return 'from-purple-600 via-pink-500 to-orange-500'; // Default gradient
    
    const activeBottle = bottles.find(bottle => bottle.key === activeProductKey);
    return activeBottle?.gradientBg || 'from-purple-600 via-pink-500 to-orange-500';
  };

   

  return (
    <div className="min-h-screen mytexture from-purple-600 via-pink-500 to-orange-500 text-white overflow-hidden relative">
      {/* Dynamic Background Gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b transition-colors duration-1000 ease-in-out ${getActiveGradient()}`} 
        style={{ zIndex: -1 }}
      />
      
      <Navigation isMobile={isMobile} scrollToTop={scrollToTop} />
      
      <AudioControls />

      <Hero 
        isMobile={isMobile}
        currentBottleIndex={currentBottleIndex}
        setCurrentBottleIndex={setCurrentBottleIndex}
        hoveredBottle={hoveredBottle}
        setHoveredBottle={setHoveredBottle}
        playBottleSound={playBottleSound}
        scrollToProduct={scrollToProduct}
      />

      {/* Decorative Pattern Bar */}
      
      <div className="relative w-full h-12 md:h-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-repeat-x"
          style={{
            backgroundImage: `url('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/pattern.png')`,
            backgroundSize: 'auto 55%',
            animation: 'slidePattern 30s linear infinite'
          }}
        />
      </div>

      <ProductShowcase productRefs={productRefs} />

      <CallToAction />

    
    

      <Footer scrollToTop={scrollToTop} />

      <BackToTop />
    </div>
  );
}

export default App;