import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield, Info } from 'lucide-react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const { language } = useLanguage();
  const [cookiePreferences, setCookiePreferences] = useState<Record<string, boolean>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  // Check if user has already set cookie preferences
  useEffect(() => {
    const consentCookie = Cookies.get('afrosoda_cookie_consent');
    
    if (!consentCookie) {
      // No consent given yet, show the banner
      setShowBanner(true);
    } else {
      try {
        // Parse saved preferences
        const savedPreferences = JSON.parse(consentCookie);
        setCookiePreferences(savedPreferences);
      } catch (error) {
        // If there's an error parsing, show the banner again
        setShowBanner(true);
      }
    }
  }, []);

  const cookieCategories: CookieCategory[] = [
    {
      id: 'necessary',
      name: language === 'en' ? 'Necessary' : 'Notwendig',
      description: language === 'en' 
        ? 'These cookies are essential for the website to function properly.' 
        : 'Diese Cookies sind für die ordnungsgemäße Funktion der Website unerlässlich.',
      required: true
    },
    {
      id: 'functional',
      name: language === 'en' ? 'Functional' : 'Funktional',
      description: language === 'en'
        ? 'These cookies enable personalized features and functionality.'
        : 'Diese Cookies ermöglichen personalisierte Funktionen und Merkmale.',
      required: false
    },
    {
      id: 'analytics',
      name: language === 'en' ? 'Analytics' : 'Analyse',
      description: language === 'en'
        ? 'These cookies help us understand how visitors interact with our website.'
        : 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.',
      required: false
    },
    {
      id: 'marketing',
      name: language === 'en' ? 'Marketing' : 'Marketing',
      description: language === 'en'
        ? 'These cookies are used to track visitors across websites to display relevant advertisements.'
        : 'Diese Cookies werden verwendet, um Besucher über Websites hinweg zu verfolgen und relevante Werbung anzuzeigen.',
      required: false
    }
  ];

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    
    setCookiePreferences(allAccepted);
    Cookies.set('afrosoda_cookie_consent', JSON.stringify(allAccepted), { expires: 365 });
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectAll = () => {
    const allRejected = {
      necessary: true, // Necessary cookies are always required
      functional: false,
      analytics: false,
      marketing: false
    };
    
    setCookiePreferences(allRejected);
    Cookies.set('afrosoda_cookie_consent', JSON.stringify(allRejected), { expires: 365 });
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    Cookies.set('afrosoda_cookie_consent', JSON.stringify(cookiePreferences), { expires: 365 });
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleToggleCategory = (categoryId: string) => {
    if (categoryId === 'necessary') return; // Cannot toggle necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleOpenPreferences = () => {
    setShowPreferences(true);
  };

  // Function to manually open the cookie banner (for use in Privacy Policy page)
  const openCookieSettings = () => {
    setShowBanner(true);
    setShowPreferences(true);
  };

  // Expose the function to window object so it can be called from other components
  useEffect(() => {
    (window as any).openCookieSettings = openCookieSettings;
    
    return () => {
      delete (window as any).openCookieSettings;
    };
  }, []);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="bg-black/80 backdrop-blur-md text-white rounded-xl shadow-xl border border-white/10 overflow-hidden">
              {!showPreferences ? (
                // Simple banner
                <div className="p-4 md:p-6">
                  <div className="flex items-start">
                    <Cookie className="w-8 h-8 text-yellow-400 mr-4 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 font-heading">
                        {language === 'en' ? 'We Value Your Privacy' : 'Wir schätzen Ihre Privatsphäre'}
                      </h3>
                      <p className="mb-4">
                        {language === 'en' 
                          ? 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Visit our'
                          : 'Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, personalisierte Anzeigen oder Inhalte zu präsentieren und unseren Verkehr zu analysieren. Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung von Cookies zu. Besuchen Sie unsere'
                        } <Link to="/privacy" className="text-yellow-400 hover:underline">
                          {language === 'en' ? 'Privacy Policy' : 'Datenschutzerklärung'}
                        </Link> {language === 'en' ? 'to learn more.' : 'um mehr zu erfahren.'}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleOpenPreferences}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          {language === 'en' ? 'Cookie Settings' : 'Cookie-Einstellungen'}
                        </button>
                        <button
                          onClick={handleRejectAll}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          {language === 'en' ? 'Reject All' : 'Alle ablehnen'}
                        </button>
                        <button
                          onClick={handleAcceptAll}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-500 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          {language === 'en' ? 'Accept All' : 'Alle akzeptieren'}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBanner(false)}
                      className="ml-4 p-1 text-white/60 hover:text-white transition-colors"
                      aria-label="Close cookie banner"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ) : (
                // Detailed preferences panel
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold font-heading flex items-center">
                      <Shield className="w-6 h-6 mr-2 text-yellow-400" />
                      {language === 'en' ? 'Cookie Preferences' : 'Cookie-Einstellungen'}
                    </h3>
                    <button
                      onClick={() => setShowPreferences(false)}
                      className="p-1 text-white/60 hover:text-white transition-colors"
                      aria-label="Back to simple banner"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <p className="mb-6">
                    {language === 'en'
                      ? 'You can choose which categories of cookies you want to accept. Necessary cookies cannot be disabled as they are required for the website to function properly.'
                      : 'Sie können wählen, welche Kategorien von Cookies Sie akzeptieren möchten. Notwendige Cookies können nicht deaktiviert werden, da sie für die ordnungsgemäße Funktion der Website erforderlich sind.'}
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    {cookieCategories.map(category => (
                      <div key={category.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <h4 className="font-bold">{category.name}</h4>
                            {category.required && (
                              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                {language === 'en' ? 'Required' : 'Erforderlich'}
                              </span>
                            )}
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={cookiePreferences[category.id]}
                              onChange={() => handleToggleCategory(category.id)}
                              disabled={category.required}
                            />
                            <div className={`w-11 h-6 rounded-full peer ${
                              cookiePreferences[category.id] 
                                ? 'bg-yellow-500' 
                                : 'bg-gray-700'
                            } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                          </label>
                        </div>
                        <p className="text-sm text-white/70">{category.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {language === 'en' ? 'Reject All' : 'Alle ablehnen'}
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {language === 'en' ? 'Accept All' : 'Alle akzeptieren'}
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-500 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {language === 'en' ? 'Save Preferences' : 'Einstellungen speichern'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;