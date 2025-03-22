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

type RequestType = 'access' | 'delete' | 'rectify' | 'restrict' | 'portability' | 'object';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  requestType: RequestType;
  message: string;
  consentGiven: boolean;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  requestType: 'access',
  message: '',
  consentGiven: false
};

const DataRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { language } = useLanguage();

  const requestTypeLabels: Record<RequestType, string> = {
    access: language === 'en' ? 'Access My Data' : 'Zugriff auf meine Daten',
    delete: language === 'en' ? 'Delete My Data' : 'Meine Daten löschen',
    rectify: language === 'en' ? 'Correct My Data' : 'Meine Daten korrigieren',
    restrict: language === 'en' ? 'Restrict Processing' : 'Verarbeitung einschränken',
    portability: language === 'en' ? 'Data Portability' : 'Datenübertragbarkeit',
    object: language === 'en' ? 'Object to Processing' : 'Widerspruch gegen die Verarbeitung'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
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
    
    if (!formData.message.trim()) {
      newErrors.message = language === 'en' ? 'Please provide details about your request' : 'Bitte geben Sie Details zu Ihrer Anfrage an';
    }
    
    if (!formData.consentGiven) {
      newErrors.consentGiven = language === 'en' ? 'You must consent to the processing of your data' : 'Sie müssen der Verarbeitung Ihrer Daten zustimmen';
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
      // Store the data request in Supabase
      const { error } = await supabase
        .from('data_requests')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            request_type: formData.requestType,
            message: formData.message,
            status: 'pending'
          }
        ]);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Success!
      setSubmitStatus('success');
      setFormData(initialFormData);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting data request:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 font-heading">
        {language === 'en' ? 'Data Subject Request Form' : 'Formular für Betroffenenanfragen'}
      </h2>
      
      {submitStatus === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-start"
        >
          <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg mb-1">
              {language === 'en' ? 'Request Submitted Successfully' : 'Anfrage erfolgreich eingereicht'}
            </h3>
            <p>
              {language === 'en'
                ? 'Thank you for submitting your request. We will process it as soon as possible and contact you at the email address you provided.'
                : 'Vielen Dank für Ihre Anfrage. Wir werden sie so schnell wie möglich bearbeiten und Sie unter der von Ihnen angegebenen E-Mail-Adresse kontaktieren.'}
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
                  {language === 'en' ? 'Error Submitting Request' : 'Fehler beim Einreichen der Anfrage'}
                </h3>
                <p>{errorMessage || (language === 'en'
                  ? 'There was an error submitting your request. Please try again later.'
                  : 'Beim Einreichen Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.')}
                </p>
              </div>
            </div>
          )}
          
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
          
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium">
              {language === 'en' ? 'Email Address' : 'E-Mail-Adresse'} <span className="text-red-500">*</span>
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
          
          <div className="mb-6">
            <label htmlFor="requestType" className="block mb-2 font-medium">
              {language === 'en' ? 'Request Type' : 'Anfrageart'} <span className="text-red-500">*</span>
            </label>
            <select
              id="requestType"
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {Object.entries(requestTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-medium">
              {language === 'en' ? 'Details of Your Request' : 'Details Ihrer Anfrage'} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-2 bg-white/10 border ${
                errors.message ? 'border-red-500' : 'border-white/20'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              placeholder={language === 'en' 
                ? "Please provide specific details about your request..." 
                : "Bitte geben Sie spezifische Details zu Ihrer Anfrage an..."}
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-red-500 text-sm">{errors.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consentGiven"
                  name="consentGiven"
                  type="checkbox"
                  checked={formData.consentGiven}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
                />
              </div>
              <label htmlFor="consentGiven" className="ml-2 text-sm">
                {language === 'en'
                  ? 'I consent to the processing of my personal data for the purpose of handling this request. I understand that AfroSoda needs to verify my identity and may contact me for additional information.'
                  : 'Ich stimme der Verarbeitung meiner personenbezogenen Daten zum Zweck der Bearbeitung dieser Anfrage zu. Ich verstehe, dass AfroSoda meine Identität überprüfen muss und mich für zusätzliche Informationen kontaktieren kann.'} <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.consentGiven && (
              <p className="mt-1 text-red-500 text-sm">{errors.consentGiven}</p>
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
                {language === 'en' ? 'Processing...' : 'Wird verarbeitet...'}
              </>
            ) : (
              language === 'en' ? 'Submit Request' : 'Anfrage einreichen'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default DataRequestForm;