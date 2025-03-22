import { useCallback } from 'react';
import { translations } from '../translations';
import type { Translation } from '../translations';
import { useLanguage } from '../context/LanguageContext';

export function useTranslation() {
  // Use the language from context
  const { language } = useLanguage();

  const t = useCallback(
    <
      K1 extends keyof Translation,
      K2 extends keyof Translation[K1],
      K3 extends keyof Translation[K1][K2]
    >(
      key1: K1,
      key2: K2,
      key3?: K3
    ): K3 extends keyof Translation[K1][K2]
      ? Translation[K1][K2][K3]
      : Translation[K1][K2] => {
      const translation = translations[language];
      if (key3) {
        return translation[key1][key2][key3 as keyof typeof translation[K1][K2]];
      }
      return translation[key1][key2];
    },
    [language]
  );

  return { t, language };
}