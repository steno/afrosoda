import { useCallback } from 'react';
import { translations } from '../translations';
import { useLanguage } from '../context/LanguageContext';

export function useTranslation() {
  // Use the language from context
  const { language } = useLanguage();

  const t = useCallback(
    (key1: string, key2?: string, key3?: string, key4?: string, key5?: string): any => {
      const translation = translations[language] as any;
      if (key5 && key4 && key3 && key2) {
        return translation[key1]?.[key2]?.[key3]?.[key4]?.[key5];
      }
      if (key4 && key3 && key2) {
        return translation[key1]?.[key2]?.[key3]?.[key4];
      }
      if (key3 && key2) {
        return translation[key1]?.[key2]?.[key3];
      }
      if (key2) {
        return translation[key1]?.[key2];
      }
      return translation[key1];
    },
    [language]
  );

  return { t, language };
}