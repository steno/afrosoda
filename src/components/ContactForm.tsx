import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Loader } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface FormData {
  businessType: string;
  company: string;
  street: string;
  postalCode: string;
  city: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  marketingConsent: boolean;
  privacyConsent: boolean;
}

const initialFormData: FormData = {
  businessType: '',
  company: '',
  street: '',
  postalCode: '',
  city: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
  marketingConsent: false,
  privacyConsent: false
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { language } = useLanguage();

  const businessTypes = [
    { value: '', label: { en: 'Please select...', de: 'Bitte auswählen...' } },
    { value: 'restaurant', label: { en: 'Restaurant', de: 'Restaurant' } },
    { value: 'supplier', label: { en: 'Supplier', de: 'Zulieferer' } },
    { value: 'hotel', label: { en: 'Hotel', de: 'Hotel' } },
    { value: 'bar', label: { en: 'Bar', de: 'Bar' } }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.businessType) {
      newErrors.businessType = language === 'en' ? 'Please select your business type' : 'Bitte wählen Sie Ihren Geschäftstyp';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = language === 'en' ? 'Company name is required' : 'Firmenname ist erforderlich';
    }
    
    if (!formData.street.trim()) {
      newErrors.street = language === 'en' ? 'Street address is required' : 'Straße ist erforderlich';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = language === 'en' ? 'Postal code is required' : 'Postleitzahl ist erforderlich';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = language === 'en' ? 'City is required' : 'Stadt ist erforderlich';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = language === 'en' ? 'First name is required' : 'Vorname ist erforderlich';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = language === 'en' ? 'Last name is required' : 'Nachname ist erforderlich';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'en' ? 'Email is required' : 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'en' ? 'Email is invalid' : 'E-Mail ist ungültig';
    }
    
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = language === 'en' ? 'You must agree to the privacy policy' : 'Sie müssen der Datenschutzerklärung zustimmen';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            business_type: formData.businessType,
            company: formData.company,
            street: formData.street,
            postal_code: formData.postalCode,
            city: formData.city,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            message: formData.message,
            marketing_consent: formData.marketingConsent,
            status: 'new'
          }
        ]);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSubmitStatus('success');
      setFormData(initialFormData);
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-purple mytexture text-white backdrop-blur-md rounded-xl p-6 md:p-8 shadow-lg">
      {/*<h2 className="text-2xl font-bold mb-6 font-heading">
        {language === 'en' ? 'Contact Us' : 'Kontaktieren Sie uns'}
      </h2>*/}
      
      {submitStatus === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-start"
        >
          <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg mb-1">
              {language === 'en' ? 'Message Sent Successfully' : 'Nachricht erfolgreich gesendet'}
            </h3>
            <p>
              {language === 'en' 
                ? 'Thank you for contacting us! We will get back to you as soon as possible.'
                : 'Vielen Dank für Ihre Kontaktaufnahme! Wir werden uns so schnell wie möglich bei Ihnen melden.'}
            </p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          {submitStatus === 'error' && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">
                  {language === 'en' ? 'Error Sending Message' : 'Fehler beim Senden der Nachricht'}
                </h3>
                <p>{errorMessage || (language === 'en' 
                  ? 'There was an error sending your message. Please try again later.'
                  : 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.')}
                </p>
              </div>
            </div>
          )}

          {/* Business Type Selection */}
          <div className="mb-6">
            <label htmlFor="businessType" className="block mb-2 font-medium">
              {language === 'en' ? 'What are you?' : 'Was sind Sie?'} <span className="text-red-500">*</span>
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-white/10 border ${
                errors.businessType ? 'border-red-500' : 'border-white/20'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white`}
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-800">
                  {type.label[language === 'en' ? 'en' : 'de']}
                </option>
              ))}
            </select>
            {errors.businessType && (
              <p className="mt-1 text-red-500 text-sm">{errors.businessType}</p>
            )}
          </div>

          {/* Company Information */}
          <div className="mb-6">
            <label htmlFor="company" className="block mb-2 font-medium">
              {language === 'en' ? 'Company' : 'Firma'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-white/10 border ${
                errors.company ? 'border-red-500' : 'border-white/20'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
            />
            {errors.company && (
              <p className="mt-1 text-red-500 text-sm">{errors.company}</p>
            )}
          </div>

          {/* Address Fields */}
          <div className="mb-6">
            <label htmlFor="street" className="block mb-2 font-medium">
              {language === 'en' ? 'Street' : 'Straße'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-white/10 border ${
                errors.street ? 'border-red-500' : 'border-white/20'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
            />
            {errors.street && (
              <p className="mt-1 text-red-500 text-sm">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="postalCode" className="block mb-2 font-medium">
                {language === 'en' ? 'Postal Code' : 'Postleitzahl'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/10 border ${
                  errors.postalCode ? 'border-red-500' : 'border-white/20'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.postalCode && (
                <p className="mt-1 text-red-500 text-sm">{errors.postalCode}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block mb-2 font-medium">
                {language === 'en' ? 'City' : 'Ort'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/10 border ${
                  errors.city ? 'border-red-500' : 'border-white/20'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.city && (
                <p className="mt-1 text-red-500 text-sm">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="firstName" className="block mb-2 font-medium">
                {language === 'en' ? 'First Name' : 'Vorname'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/10 border ${
                  errors.firstName ? 'border-red-500' : 'border-white/20'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.firstName && (
                <p className="mt-1 text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block mb-2 font-medium">
                {language === 'en' ? 'Last Name' : 'Nachname'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/10 border ${
                  errors.lastName ? 'border-red-500' : 'border-white/20'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.lastName && (
                <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="phone" className="block mb-2 font-medium">
                {language === 'en' ? 'Phone' : 'Telefon'}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                {language === 'en' ? 'Email Address' : 'E-Mail Adresse'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-white/10 border ${
                  errors.email ? 'border-red-500' : 'border-white/20'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-medium">
              {language === 'en' ? 'Message' : 'Bemerkung'}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            ></textarea>
          </div>

          {/* Consent Checkboxes */}
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <div className="flex items-center h-5">
                <input
                  id="marketingConsent"
                  name="marketingConsent"
                  type="checkbox"
                  checked={formData.marketingConsent}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
                />
              </div>
              <label htmlFor="marketingConsent" className="ml-2 text-sm">
                {language === 'en'
                  ? 'I would like to receive marketing communications from AfroSoda about new products, promotions, and events. (Optional)'
                  : 'Ich möchte Marketingmitteilungen von AfroSoda über neue Produkte, Aktionen und Veranstaltungen erhalten. (Optional)'}
              </label>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="privacyConsent"
                  name="privacyConsent"
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
                />
              </div>
              <label htmlFor="privacyConsent" className="ml-2 text-sm">
                {language === 'en'
                  ? 'I have read and agree to the '
                  : 'Ich habe die '} 
                <Link to="/privacy" className="text-yellow-400 hover:underline">
                  {language === 'en' ? 'Privacy Policy' : 'Datenschutzerklärung'}
                </Link>
                {language === 'en' ? '.' : ' gelesen und stimme ihr zu.'} <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.privacyConsent && (
              <p className="mt-1 text-red-500 text-sm">{errors.privacyConsent}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-500 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                {language === 'en' ? 'Sending...' : 'Wird gesendet...'}
              </>
            ) : (
              language === 'en' ? 'Send Message' : 'Nachricht senden'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;