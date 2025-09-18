import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  const changeLanguage = (language: 'en' | 'pt') => {
    i18n.changeLanguage(language);
  };
  
  const currentLanguage = i18n.language as 'en' | 'pt';
  
  // Map language codes to match the app's language format
  const getAppLanguage = () => {
    return currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
  };
  
  return {
    t,
    changeLanguage,
    currentLanguage,
    appLanguage: getAppLanguage(),
    isEnglish: currentLanguage === 'en',
    isPortuguese: currentLanguage === 'pt',
  };
};
