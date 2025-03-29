import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Header from '../../components/Header';
import SettingList, {SettingListProps} from '../../components/SettingList';

const Language = () => {
  const [language, setLanguage] = useState('English');
  const LanguageList: SettingListProps = {
    title: 'Language Available',
    items: [
      {
        title: 'English',
        icon: 'globe',
        onPress: () => {
          Alert.alert('English');
          setLanguage('English');
        },
      },
      {
        title: 'Chiness',
        icon: 'globe',
        onPress: () => {
          Alert.alert('Chiness');
          setLanguage('Chiness');
        },
      },
    ],
  };

  const currentLanguage: SettingListProps = {
    title: 'Current Language',
    items: [
      {
        title: language,
        icon: 'globe',
        onPress: () => {
          // Alert.alert('English');
        },
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Header title={'Language'} backButton />

      <SettingList {...currentLanguage} />
      <SettingList {...LanguageList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBlue,
    flex: 1,
    width: '100%',
  },
});

export default Language;
