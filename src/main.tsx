import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import App from './App.tsx';
import AboutPage from './pages/About.tsx';
import PrivacyPage from './pages/Privacy.tsx';
import ContactPage from './pages/Contact.tsx';
import ImprintPage from './pages/Imprint.tsx';
import AdminPage from './pages/Admin.tsx';
import MaintenancePage from './pages/Maintenance.tsx';
import { AudioProvider } from './context/AudioContext';
import { LanguageProvider } from './context/LanguageContext';
import CookieConsent from './components/CookieConsent.tsx';
import { MAINTENANCE_MODE } from './config/maintenance';
import './index.css';

// ScrollToTop component to ensure page scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AudioProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {MAINTENANCE_MODE ? (
              <>
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/imprint" element={<ImprintPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<MaintenancePage />} />
              </>
            ) : (
              <>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/imprint" element={<ImprintPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
              </>
            )}
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </AudioProvider>
    </LanguageProvider>
  </StrictMode>
);