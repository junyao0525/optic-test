import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const LANG_STORAGE_KEY = '@app_language';

export const useLanguage = () => {
  const {i18n: i18nextInstance} = useTranslation();

  const changeLanguage = async (lang: string) => {
    try {
      await i18nextInstance.changeLanguage(lang);
      await AsyncStorage.setItem(LANG_STORAGE_KEY, lang);
      console.log('Language changed and saved:', lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentLanguage = i18nextInstance.language;

  return {currentLanguage, changeLanguage};
};
