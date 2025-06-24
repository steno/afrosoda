import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import SimpleLayout from '../components/SimpleLayout';
import { useTranslation } from '../hooks/useTranslation';
import ContactForm from '../components/ContactForm';
import { useLanguage } from '../context/LanguageContext';
import HorizontalBar from '../components/HorizontalBar';

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

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();

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
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {heroBubbles.map((bubble, i) => (
            <Bubble key={`hero-bubble-${i}`} {...bubble} />
          ))}
        </div>
        <div className="absolute inset-0 mytexture bg-black/30" />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-6 mt-8 font-heading"
          >
            {language === 'en' ? 'Get in Touch' : 'Kontaktieren Sie uns'}
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-center max-w-3xl mx-auto"
          >
            {language === 'en' 
              ? "We'd love to hear from you! Send us a message and we'll respond as soon as possible."
              : "Wir würden uns freuen, von Ihnen zu hören! Senden Sie uns eine Nachricht und wir werden so schnell wie möglich antworten."}
          </motion.p>
        </div>

      </section>

   {/*  <div>
      <HorizontalBar />
    </div>*/}


      {/* Decorative Pattern Bar 
      <div className="relative w-full h-16 md:h-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-repeat-x"
          style={{
            backgroundImage: `url('https://frdmalzedskscaopornt.supabase.co/storage/v1/object/public/media/images/pattern.png')`,
            backgroundSize: 'auto 55%',
            animation: 'slidePattern 30s linear infinite'
          }}
        />
      </div>*/}

      {/* Contact Information and Form */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div >
              {/*<h2 className="text-3xl font-bold mb-8 font-heading">
                {language === 'en' ? '' : ''}
              </h2>*/}
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-heading">
                      {language === 'en' ? 'Our Location' : 'Unser Standort'}
                    </h3>
                    <address className="not-italic text-gray-600">
                      {Array.isArray(t('contact', 'address')) && 
                        t('contact', 'address').map((line: string, index: number) => (
                          <div key={index}>{line}</div>
                        ))}
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-heading">
                      {language === 'en' ? 'Email Us' : 'E-Mail'}
                    </h3>
                    <p className="text-gray-600">{t('contact', 'email')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-heading">
                      {language === 'en' ? 'Call Us' : 'Rufen Sie uns an'}
                    </h3>
                    <p className="text-gray-600">{t('contact', 'phone')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-heading">
                      {language === 'en' ? 'Business Hours' : 'Geschäftszeiten'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en' ? 'Monday - Friday: 9:00 AM - 4:00 PM' : 'Montag - Freitag: 9:00 - 16:00 Uhr'}
                    </p>
                    <p className="text-gray-600">
                      {language === 'en' ? 'Saturday and Sunday: Closed' : 'Samstag und Sonntag: Geschlossen'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4 font-heading">
                  {language === 'en' ? 'Our Location' : 'Unser Standort'}
                </h3>
                <div className="rounded-xl overflow-hidden h-64 bg-gray-200">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.654394599542!2d13.32998231579!3d52.47952197980776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a85040fb8d0291%3A0xd0461e0d18a5aa9!2sKonradinstra%C3%9Fe%205%2C%2012105%20Berlin%2C%20Germany!5e0!3m2!1sen!2sus!4v1624456789012!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    title="AfroSoda Office Location"
                  ></iframe>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold mb-8 font-heading">
                {language === 'en' ? 'For Businesses.' : 'Fuer Geschäfte.'}
              </h3>
              <h4 className="text-1xl  mb-8 font-heading">
                {language === 'en' ? 'If you would like to offer AfroSoda to your customers, fill out the following form.' : 'Falls Du AfroSoda deinen Kunden anbieten möchtest, fülle folgendes Formular aus.'}
              </h4>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 font-heading">
            {language === 'en' ? 'Frequently Asked Questions' : 'Häufig gestellte Fragen'}
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2 font-heading">
                {language === 'en' ? 'How quickly will I receive a response?' : 'Wie schnell erhalte ich eine Antwort?'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'We aim to respond to all inquiries within 24-48 business hours. For urgent matters, please call us directly.'
                  : 'Wir bemühen uns, alle Anfragen innerhalb von 24-48 Geschäftsstunden zu beantworten. Bei dringenden Angelegenheiten rufen Sie uns bitte direkt an.'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2 font-heading">
                {language === 'en' ? 'Can I visit your office without an appointment?' : 'Kann ich Ihr Büro ohne Termin besuchen?'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'We recommend scheduling an appointment to ensure that the appropriate team member is available to assist you. Please contact us in advance to arrange a visit.'
                  : 'Wir empfehlen, einen Termin zu vereinbaren, um sicherzustellen, dass das entsprechende Teammitglied verfügbar ist, um Ihnen zu helfen. Bitte kontaktieren Sie uns im Voraus, um einen Besuch zu arrangieren.'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2 font-heading">
                {language === 'en' ? 'How can I become a distributor for AfroSoda?' : 'Wie kann ich Vertriebspartner für AfroSoda werden?'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'For distribution inquiries, please contact us through the form above and select "Business Partnership" as the subject. Our business development team will get in touch with you to discuss opportunities.'
                  : 'Für Vertriebsanfragen kontaktieren Sie uns bitte über das obige Formular und wählen Sie "Geschäftspartnerschaft" als Betreff. Unser Business-Development-Team wird sich mit Ihnen in Verbindung setzen, um Möglichkeiten zu besprechen.'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-2 font-heading">
                {language === 'en' ? 'How do I request a data deletion under GDPR?' : 'Wie beantrage ich eine Datenlöschung gemäß DSGVO?'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'You can submit a data deletion request through our'
                  : 'Sie können einen Antrag auf Datenlöschung über unsere'} <a href="/privacy" className="text-purple-600 hover:underline">
                  {language === 'en' ? 'Privacy Policy' : 'Datenschutzerklärung'}
                </a> {language === 'en'
                  ? 'page. We will process your request within 30 days as required by GDPR regulations.'
                  : 'Seite einreichen. Wir werden Ihren Antrag innerhalb von 30 Tagen bearbeiten, wie von der DSGVO vorgeschrieben.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </SimpleLayout>
  );
};

export default ContactPage;