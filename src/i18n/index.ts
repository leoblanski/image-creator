import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';

// Import translations
import en from './locales/en.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

// Get device language - Expo compatible version
const getDeviceLanguage = (): string => {
  if (Platform.OS === 'web') {
    const browserLang = navigator.language || 'en';
    return browserLang.startsWith('pt') ? 'pt' : 'en';
  }
  
  // For React Native, we'll use a simple approach
  // In a real app, you might want to use AsyncStorage to remember user preference
  return 'en'; // Default to English, user can change in settings
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
