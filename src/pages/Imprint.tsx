import React from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Phone, Mail, FileText, Scale } from 'lucide-react';
import SimpleLayout from '../components/SimpleLayout';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import Bubble from '../components/animations/Bubble';

const ImprintPage: React.FC = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const bubbles = Array.from({ length: 150 }, (_, i) => ({
    delay: i * 0.2,
    size: 6 + Math.random() * 28,
    x: Math.random() * window.innerWidth,
  }));

  return (
    <SimpleLayout>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[5]">
        {bubbles.map((bubble, i) => (
          <Bubble key={i} {...bubble} />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#f5821f] via-[#d4451f] to-[#c91713] text-white overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-6 mt-8 font-heading"
            style={{ color: 'antiquewhite' }}
          >
            {t('imprint', 'hero', 'title')}
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-center max-w-3xl mx-auto"
          >
            {t('imprint', 'hero', 'subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          
          {/* Company Information */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff7f50] mr-3">
                <Building className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 font-heading">
                {t('imprint', 'sections', 'company', 'title')}
              </h2>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {t('imprint', 'sections', 'company', 'name')}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start mb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ff7f50] mr-3 mt-0.5">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">
                        {language === 'en' ? 'Address' : 'Adresse'}
                      </p>
                      <address className="not-italic text-gray-600">
                        {t('imprint', 'sections', 'company', 'address')?.map((line: string, index: number) => (
                          <React.Fragment key={index}>
                            {line}
                            {index < (t('imprint', 'sections', 'company', 'address') as string[])?.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </address>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start mb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ff7f50] mr-3 mt-0.5">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">
                        {language === 'en' ? 'Phone' : 'Telefon'}
                      </p>
                      <p className="text-gray-600">{t('imprint', 'sections', 'company', 'contact', 'phone')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ff7f50] mr-3 mt-0.5">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">E-Mail</p>
                      <p className="text-gray-600">{t('imprint', 'sections', 'company', 'contact', 'email')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ff7f50] mr-3 mt-0.5">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">
                        {language === 'en' ? 'VAT ID' : 'USt-IdNr.'}
                      </p>
                      <p className="text-gray-600">DE211838991</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Management */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
              {t('imprint', 'sections', 'management', 'title')}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600">
                {t('imprint', 'sections', 'management', 'content')}
              </p>
            </div>
          </section>

          {/* Responsible for Content */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
              {t('imprint', 'sections', 'responsible', 'title')}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <address className="not-italic text-gray-600">
                {t('imprint', 'sections', 'responsible', 'content')?.map((line: string, index: number) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < (t('imprint', 'sections', 'responsible', 'content') as string[])?.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </address>
            </div>
          </section>

          {/* Liability for Content */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
              {t('imprint', 'sections', 'liability', 'title')}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600">
                {t('imprint', 'sections', 'liability', 'content')}
              </p>
            </div>
          </section>

          {/* Liability for Links */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
              {t('imprint', 'sections', 'links', 'title')}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600">
                {t('imprint', 'sections', 'links', 'content')}
              </p>
            </div>
          </section>

          {/* Copyright */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 font-heading">
              {t('imprint', 'sections', 'copyright', 'title')}
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600">
                {t('imprint', 'sections', 'copyright', 'content')}
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-12">
            <div className="flex items-center mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff7f50] mr-3">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 font-heading">
                {t('imprint', 'sections', 'dispute', 'title')}
              </h3>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <p className="text-blue-700">
                {t('imprint', 'sections', 'dispute', 'content')}
              </p>
            </div>
          </section>

          <div className="text-sm text-gray-500 text-center">
            {t('imprint', 'sections', 'lastUpdated')}
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default ImprintPage;