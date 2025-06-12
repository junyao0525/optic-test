import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/en.json';
import ms from './ms/ms.json';
import zh from './zh/zh.json';

const LANG_STORAGE_KEY = '@app_language';

// Initialize with default language first
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      },
      ms: {
        translation: ms
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Then load saved language preference
const loadSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANG_STORAGE_KEY);
    if (savedLanguage) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Error loading saved language:', error);
  }
};

// Set up language change listener
i18n.on('languageChanged', async (lng) => {
  console.log('Language changed to:', lng);
  try {
    await AsyncStorage.setItem(LANG_STORAGE_KEY, lng);
  } catch (error) {
    console.error('Error saving language preference:', error);
  }
});

// Load saved language
loadSavedLanguage();

export default i18n;
