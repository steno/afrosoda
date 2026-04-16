import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';
import { useLanguage } from './context/LanguageContext';
import { useAudio } from './context/AudioContext';
import { AnimationProvider } from './context/AnimationContext';
import BackToTop from './components/BackToTop';
import Navigation from './components/layout/Navigation';
import Hero from './components/sections/Hero';
import ProductShowcase from './components/sections/ProductShowcase';
import CallToAction from './components/sections/CallToAction';
import Footer from './components/layout/Footer';
import { bottles, DEFAULT_HOME_SCROLL_BG } from './data/bottles';

function App() {
  const { language } = useLanguage();
  const [hoveredBottle, setHoveredBottle] = useState<string | null>(null);
  const [soundsInitialized, setSoundsInitialized] = useState(false);
  const { t } = useTranslation(language);
  const { initializeAudio } = useAudio();
  const [isMobile, setIsMobile] = useState(false);
  const [currentBottleIndex, setCurrentBottleIndex] = useState(0);
  const [activeProductKey, setActiveProductKey] = useState<string | null>(null);

  // Create refs for bottle sounds
  const bottleSoundsRef = useRef<{ [key: string]: HTMLAudioElement | null }>({
    goldenHibiscus: null,
    kinkyCocomut: null,
    magicMango: null,
    bubbleBanana: null
  });

  // Create refs for each product section
  const productSectionRef = useRef<HTMLElement>(null);
  const productRefs = useRef<{ [key: string]: HTMLDivElement | null }>({
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
      bottleSoundsRef.current = {
        goldenHibiscus: new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/bottleopening.mp3'),
        kinkyCocomut: new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/bottleopening.mp3'),
        magicMango: new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/bottleopening.mp3'),
        bubbleBanana: new Audio('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/music/bottleopening.mp3')
      };

      Object.values(bottleSoundsRef.current).forEach(audio => {
        if (audio) {
          audio.volume = 0.7; // Fixed volume
          audio.load();
        }
      });

      setSoundsInitialized(true);
    }
  }, [soundsInitialized]);

  // Prime audio on first user interaction (runs once)
  const interactionHandledRef = useRef(false);
  useEffect(() => {
    const handleUserInteraction = () => {
      if (interactionHandledRef.current) return;
      interactionHandledRef.current = true;

      initializeAudio();
      Object.values(bottleSoundsRef.current).forEach(audio => {
        if (audio) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                audio.pause();
                audio.currentTime = 0;
              })
              .catch(() => {});
          }
        }
      });

      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [initializeAudio]);

  // Track scroll position to determine active product
  useEffect(() => {
    const handleScroll = () => {
      if (Object.values(productRefs.current).some(ref => ref !== null)) {
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

        const viewportHeight = window.innerHeight;
        let maxVisibleProduct = null;
        let maxVisibleArea = 0;

        for (const product of productPositions) {
          const visibleTop = Math.max(0, product.top);
          const visibleBottom = Math.min(viewportHeight, product.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visiblePercentage = visibleHeight / product.height;

          if (visiblePercentage > maxVisibleArea) {
            maxVisibleArea = visiblePercentage;
            maxVisibleProduct = product.key;
          }
        }

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
        audio.volume = 0.7; // Fixed volume
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

    // Ensure refs are available and DOM is ready
    const scrollToSection = () => {
      // Step 1: Scroll to the product section
      if (productSectionRef.current) {
        productSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.warn('productSectionRef is not available');
      }

      // Step 2: Scroll to the specific product
      setTimeout(() => {
        const productElement = productRefs.current[bottleKey];
        if (productElement) {
          const offset = isMobile ? 50 : 100;
          const elementPosition = productElement.getBoundingClientRect().top + window.pageYOffset;
          const targetPosition = elementPosition - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          console.log(`Scrolling to ${bottleKey} at position: ${targetPosition}`);
        } else {
          console.warn(`Product ref for ${bottleKey} is not available`);
        }
      }, isMobile ? 300 : 500);
    };

    // Use requestAnimationFrame for smoother execution
    requestAnimationFrame(scrollToSection);
  };

  // Get the current active bottle's gradient
  const getActiveGradient = () => {
    if (!activeProductKey) return DEFAULT_HOME_SCROLL_BG;
    const activeBottle = bottles.find(bottle => bottle.key === activeProductKey);
    return activeBottle?.gradientBg || DEFAULT_HOME_SCROLL_BG;
  };

  return (
    <AnimationProvider>
      <div
        className={`min-h-screen ${DEFAULT_HOME_SCROLL_BG} text-white overflow-hidden relative`}
      >
        {/* Dynamic Background Gradient */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ease-in-out ${getActiveGradient()}`}
          style={{ zIndex: -1 }}
        />

        <Navigation isMobile={isMobile} scrollToTop={scrollToTop} />
        <Hero
          isMobile={isMobile}
          currentBottleIndex={currentBottleIndex}
          setCurrentBottleIndex={setCurrentBottleIndex}
          hoveredBottle={hoveredBottle}
          setHoveredBottle={setHoveredBottle}
          playBottleSound={playBottleSound}
          scrollToProduct={scrollToProduct}
        />
        <div className="relative w-full h-12 md:h-12 overflow-hidden">
          <div
            className="absolute inset-0 bg-repeat-x"
            style={{
              backgroundImage: `url('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/pattern.png')`,
              backgroundSize: 'auto 80%',
              animation: 'slidePattern 30s linear infinite'
            }}
          />
        </div>
        <ProductShowcase productRefs={productRefs} />
        <CallToAction />
        <Footer scrollToTop={scrollToTop} />
        <BackToTop />
      </div>
    </AnimationProvider>
  );
}

export default App;