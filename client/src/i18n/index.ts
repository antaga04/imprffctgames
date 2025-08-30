import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/i18n/locales/en/translation.json';
import es from '@/i18n/locales/es/translation.json';

i18n.use(LanguageDetector) // Automatically detect user language
    .use(initReactI18next) // Pass i18n instance to react-i18next
    .init({
        fallbackLng: 'en', // Default language if detection fails
        supportedLngs: ['en', 'es'], // List of supported languages
        resources: {
            en: { translation: en },
            es: { translation: es },
        },
        detection: {
            // Options for the language detector
            order: ['localStorage', 'navigator'], // Check localStorage first, then browser
            caches: ['localStorage'], // Store language preference in localStorage
        },
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
