import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with the stored language or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    return (storedLanguage === 'en' || storedLanguage === 'de') ? storedLanguage as Language : 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    
    // Dispatch a custom event to notify other components about the language change
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'preferredLanguage',
      newValue: language
    }));
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};