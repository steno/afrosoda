import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, AlertTriangle, ExternalLink, Clock, Cookie } from 'lucide-react';
import SimpleLayout from '../components/SimpleLayout';
import { useTranslation } from '../hooks/useTranslation';
import DataRequestForm from '../components/DataRequestForm';
import { useLanguage } from '../context/LanguageContext';

// Reuse the Bubble component from App.tsx
const Bubble = ({ delay = 0, size = 100, x = 0 }: { delay?: number; size?: number; x?: number }) => (
  <motion.div
    initial={{ y: '100vh', opacity: 0.7 }}
    animate={{
      y: '-100vh',
      opacity: [0.7, 0.9, 0.7],
      x: [x, x + 50, x],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
      x: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }}
    className="absolute rounded-full bg-white/10 backdrop-blur-sm pointer-events-none"
    style={{
      width: size,
      height: size,
    }}
  />
);

const PrivacyPage: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'policy' | 'rights'>('policy');

  // Function to open cookie settings
  const openCookieSettings = () => {
    if (window && (window as any).openCookieSettings) {
      (window as any).openCookieSettings();
    }
  };

  // Helper function to safely get string values
  const getString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return '';
  };

   // Generate bubbles for the hero section
  const heroBubbles = Array.from({ length: 10 }, (_, i) => ({
    delay: i * 2,
    size: 50 + Math.random() * 100,
    x: (i % 5) * (window.innerWidth / 5) + Math.random() * 100 - 50,
  }));
  
  return (
    <SimpleLayout>
      {/* Hero Section */}
      <section className="relative py-20 bg-purple text-white overflow-hidden">
         {/* Animated Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroBubbles.map((bubble, i) => (
            <Bubble key={`hero-bubble-${i}`} {...bubble} />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/30 mytexture" />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-6 mt-8 font-heading"
          >
            {getString(t('privacy', 'hero', 'title'))}
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-center max-w-3xl mx-auto"
          >
            {getString(t('privacy', 'hero', 'subtitle'))}
          </motion.p>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('policy')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'policy' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {language === 'en' ? 'Privacy Policy' : 'Datenschutz'}
            </button>
            <button
              onClick={() => setActiveTab('rights')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'rights' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {language === 'en' ? 'Your Rights & Data Requests' : 'Ihre Rechte & Datenanfragen'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'policy' ? (
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-800 font-heading">
                    {language === 'en' ? 'Privacy Policy' : 'Datenschutz'}
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {language === 'en' ? 'Last updated: June 15, 2024' : 'Zuletzt aktualisiert: 15. Juni 2024'}
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
                  <div className="flex">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        {language === 'en' 
                          ? 'This policy applies to all information collected through our website, mobile applications, and any related services.'
                          : 'Diese Richtlinie gilt für alle Informationen, die über unsere Website, mobile Anwendungen und alle zugehörigen Dienste gesammelt werden.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Introduction */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'introduction', 'title'))}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getString(t('privacy', 'sections', 'introduction', 'content'))}
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'collection', 'title'))}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getString(t('privacy', 'sections', 'collection', 'content'))}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  {Array.isArray(t('privacy', 'sections', 'collection', 'items')) && 
                    t('privacy', 'sections', 'collection', 'items').map((item: string, index: number) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'usage', 'title'))}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getString(t('privacy', 'sections', 'usage', 'content'))}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  {Array.isArray(t('privacy', 'sections', 'usage', 'items')) && 
                    t('privacy', 'sections', 'usage', 'items').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
              </section>

              {/* Cookies */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'cookies', 'title'))}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getString(t('privacy', 'sections', 'cookies', 'content'))}
                </p>
                <button
                  onClick={openCookieSettings}
                  className="inline-flex items-center px-4 py-2 bg-black/30 text-black rounded-lg hover:bg-black/10 transition-colors"
                >
                  <Cookie className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Manage Cookie Preferences' : 'Cookie-Einstellungen verwalten'}
                </button>
              </section>

              {/* Sharing Your Information */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'sharing', 'title'))}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getString(t('privacy', 'sections', 'sharing', 'content'))}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  {Array.isArray(t('privacy', 'sections', 'sharing', 'items')) && 
                    t('privacy', 'sections', 'sharing', 'items').map((item: string, index: number) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                </ul>
              </section>

              {/* Your Rights */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'rights', 'title'))}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getString(t('privacy', 'sections', 'rights', 'content'))}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  {Array.isArray(t('privacy', 'sections', 'rights', 'items')) && 
                    t('privacy', 'sections', 'rights', 'items').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
                <p className="mt-4 text-gray-600">
                  {language === 'en' 
                    ? 'To exercise any of these rights, please visit our'
                    : 'Um eines dieser Rechte auszuüben, besuchen Sie bitte unsere'} <button 
                    onClick={() => setActiveTab('rights')}
                    className="text-purple-600 hover:underline"
                  >
                    {language === 'en' ? 'Data Subject Rights page' : 'Seite für Betroffenenrechte'}
                  </button> {language === 'en' 
                    ? 'or contact us using the information provided at the end of this policy.'
                    : 'oder kontaktieren Sie uns mit den am Ende dieser Richtlinie angegebenen Informationen.'}
                </p>
              </section>

              {/* Data Security */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'security', 'title'))}
                </h3>
                <p className="text-gray-600">
                  {getString(t('privacy', 'sections', 'security', 'content'))}
                </p>
              </section>

              {/* Children's Privacy */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'children', 'title'))}
                </h3>
                <p className="text-gray-600">
                  {getString(t('privacy', 'sections', 'children', 'content'))}
                </p>
              </section>

              {/* Changes to This Privacy Policy */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'changes', 'title'))}
                </h3>
                <p className="text-gray-600">
                  {getString(t('privacy', 'sections', 'changes', 'content'))}
                </p>
              </section>

              {/* Contact Us */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {getString(t('privacy', 'sections', 'contact', 'title'))}
                </h3>
                <p className="text-gray-600 mb-4">
                  {getString(t('privacy', 'sections', 'contact', 'content'))}
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="font-bold text-gray-800 mb-2">
                    {getString(t('privacy', 'sections',  'contact', 'info', 'company'))}
                  </p>
                  <address className="not-italic text-gray-600 mb-4">
                    {Array.isArray(t('privacy', 'sections', 'contact', 'info', 'address')) && 
                      t('privacy', 'sections', 'contact', 'info', 'address').map((line: string, index: number) => (
                        <div key={index}>{line}</div>
                      ))}
                  </address>
                  <p className="text-gray-600">
                    {getString(t('privacy', 'sections', 'contact', 'info', 'email'))}
                  </p>
                  <p className="text-gray-600">
                    {getString(t('privacy', 'sections', 'contact', 'info', 'phone'))}
                  </p>
                </div>
              </section>

              <div className="text-sm text-gray-500 text-center">
                {getString(t('privacy', 'sections', 'lastUpdated'))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Lock className="w-8 h-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-800 font-heading">
                    {language === 'en' ? 'Your Data Rights' : 'Ihre Datenrechte'}
                  </h2>
                </div>
                <p className="text-gray-600 mb-8">
                  {language === 'en'
                    ? 'Under the General Data Protection Regulation (GDPR) and other privacy laws, you have specific rights regarding your personal data. Learn about these rights and how to exercise them below.'
                    : 'Gemäß der Datenschutz-Grundverordnung (DSGVO) und anderen Datenschutzgesetzen haben Sie bestimmte Rechte in Bezug auf Ihre personenbezogenen Daten. Erfahren Sie mehr über diese Rechte und wie Sie sie unten ausüben können.'}
                </p>
              </div>

              {/* Rights Explanation */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {language === 'en' ? 'Understanding Your Rights' : 'Verstehen Sie Ihre Rechte'}
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">
                      {language === 'en' ? 'Right to Access' : 'Recht auf Zugang'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'You have the right to request copies of your personal data. We may charge a small fee for this service.'
                        : 'Sie haben das Recht, Kopien Ihrer personenbezogenen Daten anzufordern. Wir können eine kleine Gebühr für diesen Service erheben.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">
                      {language === 'en' ? 'Right to Rectification' : 'Recht auf Berichtigung'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.'
                        : 'Sie haben das Recht zu verlangen, dass wir Informationen korrigieren, die Sie für ungenau halten, oder unvollständige Informationen vervollständigen.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">
                      {language === 'en' ? 'Right to Erasure' : 'Recht auf Löschung'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'You have the right to request that we erase your personal data, under certain conditions.'
                        : 'Sie haben das Recht, unter bestimmten Bedingungen die Löschung Ihrer personenbezogenen Daten zu verlangen.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">
                      {language === 'en' ? 'Right to Restrict Processing' : 'Recht auf Einschränkung der Verarbeitung'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'You have the right to request that we restrict the processing of your personal data, under certain conditions.'
                        : 'Sie haben das Recht, unter bestimmten Bedingungen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">
                      {language === 'en' ? 'Right to Data Portability' : 'Recht auf Datenübertragbarkeit'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.'
                        : 'Sie haben das Recht, unter bestimmten Bedingungen zu verlangen, dass wir die von uns gesammelten Daten an eine andere Organisation oder direkt an Sie übertragen.'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">
                      {language === 'en' ? 'Right to Object' : 'Widerspruchsrecht'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'en'
                        ? 'You have the right to object to our processing of your personal data, under certain conditions.'
                        : 'Sie haben das Recht, unter bestimmten Bedingungen der Verarbeitung Ihrer personenbezogenen Daten durch uns zu widersprechen.'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Request Form */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 font-heading">
                  {language === 'en' ? 'Submit a Data Request' : 'Datenanfrage einreichen'}
                </h3>
                <p className="text-gray-600 mb-8">
                  {language === 'en'
                    ? 'To exercise any of your rights regarding your personal data, please fill out the form below. We will respond to your request within 30 days.'
                    : 'Um eines Ihrer Rechte bezüglich Ihrer personenbezogenen Daten auszuüben, füllen Sie bitte das untenstehende Formular aus. Wir werden innerhalb von 30 Tagen auf Ihre Anfrage antworten.'}
                </p>
                
                <DataRequestForm />
              </section>

              {/* Additional Information */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
                  {language === 'en' ? 'Additional Information' : 'Zusätzliche Informationen'}
                </h3>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex">
                    <FileText className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 mb-1">
                        {language === 'en' ? 'Verification Process' : 'Verifizierungsprozess'}
                      </p>
                      <p className="text-blue-700">
                        {language === 'en'
                          ? 'To protect your privacy, we may need to verify your identity before processing your request. We may ask for additional information to confirm your identity.'
                          : 'Um Ihre Privatsphäre zu schützen, müssen wir möglicherweise Ihre Identität überprüfen, bevor wir Ihre Anfrage bearbeiten. Wir können zusätzliche Informationen anfordern, um Ihre Identität zu bestätigen.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex">
                    <Clock className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 mb-1">
                        {language === 'en' ? 'Response Time' : 'Antwortzeit'}
                      </p>
                      <p className="text-blue-700">
                        {language === 'en'
                          ? 'We aim to respond to all legitimate requests within 30 days. Occasionally, it may take longer if your request is particularly complex or you have made several requests.'
                          : 'Wir bemühen uns, auf alle berechtigten Anfragen innerhalb von 30 Tagen zu antworten. Gelegentlich kann es länger dauern, wenn Ihre Anfrage besonders komplex ist oder Sie mehrere Anfragen gestellt haben.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <div className="flex">
                    <ExternalLink className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 mb-1">
                        {language === 'en' ? 'Complaints' : 'Beschwerden'}
                      </p>
                      <p className="text-blue-700">
                        {language === 'en'
                          ? 'If you are not satisfied with our response to your request, you have the right to lodge a complaint with your local data protection authority.'
                          : 'Wenn Sie mit unserer Antwort auf Ihre Anfrage nicht zufrieden sind, haben Sie das Recht, eine Beschwerde bei Ihrer lokalen Datenschutzbehörde einzureichen.'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  );
};

export default PrivacyPage;