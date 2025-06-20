import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { Colors } from '../../themes';

export type languageType = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isPopular: boolean;
};

const Language = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    console.log('Current language:', i18n.language);
  }, [i18n.language]);

  const handleLanguageSelect = (language: languageType) => {
    console.log('Changing language to:', language.code);
    try {
      i18n.changeLanguage(language.code).then(() => {
        console.log('Language changed successfully to:', i18n.language);
        setSelectedLanguage(language.code);
        Alert.alert(
          t('common.success'),
          t('language.changed', { language: language.name }),
        );
      }).catch(error => {
        console.error('Error in language change:', error);
        Alert.alert(t('common.error'), t('language.change_error'));
      });
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(t('common.error'), t('language.change_error'));
    }
  };

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      isPopular: true,
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      isPopular: true,
    },
    {
      code: 'ms',
      name: 'Malay',
      nativeName: 'Bahasa Melayu',
      flag: '🇲🇾',
      isPopular: true,
    },
  ];

  const renderLanguageItem = (language: languageType) => {
    const isSelected = selectedLanguage === language.code;

    return (
      <TouchableOpacity
        key={language.code}
        style={[styles.languageItem, isSelected && styles.selectedLanguageItem]}
        onPress={() => handleLanguageSelect(language)}
        activeOpacity={0.7}>
        <View style={styles.languageInfo}>
          <Text style={styles.flag}>{language.flag}</Text>
          <View style={styles.languageText}>
            <Text
              style={[styles.languageName, isSelected && styles.selectedText]}>
              {language.name}
            </Text>
            <Text
              style={[
                styles.nativeName,
                isSelected && styles.selectedNativeText,
              ]}>
              {language.nativeName}
            </Text>
          </View>
        </View>

        {language.isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>{t('language.popular')}</Text>
          </View>
        )}

        {isSelected && (
          <Icon
            name="checkmark-circle"
            size={24}
            color={Colors.primary || '#007AFF'}
          />
        )}
      </TouchableOpacity>
    );
  };

  const popularLanguages = languages.filter(lang => lang.isPopular);

  return (
    <View style={styles.container}>
      <Header title={t('settings.language')} backButton />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Current Language Section */}
        <View style={styles.currentSection}>
          <Text style={styles.sectionTitle}>{t('language.current')}</Text>
          <View style={styles.currentLanguageCard}>
            <View style={styles.currentLanguageInfo}>
              <Text style={styles.currentFlag}>
                {languages.find(lang => lang.code === selectedLanguage)?.flag ||
                  '🌐'}
              </Text>
              <View>
                <Text style={styles.currentLanguageName}>
                  {languages.find(lang => lang.code === selectedLanguage)?.name ||
                    selectedLanguage}
                </Text>
                <Text style={styles.currentNativeName}>
                  {languages.find(lang => lang.code === selectedLanguage)
                    ?.nativeName || selectedLanguage}
                </Text>
              </View>
            </View>
            <Icon
              name="globe-outline"
              size={24}
              color={Colors.primary || '#007AFF'}
            />
          </View>
        </View>

        {/* Popular Languages Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language.popular')}</Text>
          <View style={styles.languageList}>
            {popularLanguages.map(renderLanguageItem)}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Icon name="information-circle-outline" size={20} color={'#666'} />
            <Text style={styles.infoText}>
              {t('language.change_info')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  currentSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginHorizontal:5,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    marginLeft: 4,
  },
  currentLanguageCard: {
    marginHorizontal:5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  currentLanguageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  currentLanguageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  currentNativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  languageList: {
    marginHorizontal:5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  selectedLanguageItem: {
    backgroundColor: '#E3F2FD',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  selectedText: {
    color: Colors.primary || '#007AFF',
    fontWeight: '600',
  },
  nativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedNativeText: {
    color: Colors.primary || '#007AFF',
  },
  popularBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  infoSection: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
});

export default Language;
