import { Translation } from './types';
import { en } from './en';
import { de } from './de';

export const translations: { [key: string]: Translation } = {
  en,
  de,
};

export type { Translation };