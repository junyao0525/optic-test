import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import Header from '../../components/Header';
import SettingList from '../../components/SettingList';
import {Colors, TextStyle} from '../../themes';

const personImage = require('../../../assets/images/person.png');

const UserForm = {
  userName: 'John Doe',
  userEmail: 'JohnDoe@gmail.com',
  userImage: personImage,
};

const SettingScreen = () => {
  const navigation = useNavigation();
  const settingsData = {
    title: 'Personal Data',
    items: [
      {
        title: 'My Profile',
        icon: 'person-circle',
        onPress: () => {
          Alert.alert('Profile Clicked');
        },
      },
      {
        title: 'My History',
        icon: 'bar-chart',
        onPress: () => navigation.navigate('History'),
      },
    ],
    iconSize: 34,
    iconColor: Colors.lightGreen,
  };

  const otherData = {
    title: 'other',
    items: [
      {
        title: 'Language',
        icon: 'language',
        onPress: () => navigation.navigate('Language'),
      },
      {
        title: 'Help',
        icon: 'help-circle-outline',
        onPress: () => navigation.navigate('Help'),
      },
      {
        title: 'About',
        icon: 'alert-circle-outline',
        onPress: () => navigation.navigate('About'),
      },
    ],
    iconSize: 34,
    iconColor: Colors.lightGreen,
  };
  return (
    <>
      <View>
        <Header title="Setting" menuButton />
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoStyle}>
            <Image
              source={UserForm.userImage}
              style={styles.userImageContainer}
            />
            <View>
              <Text style={{...TextStyle.H3B, color: Colors.black}}>
                {UserForm.userName}
              </Text>
              <Text style={{...TextStyle.P1B, color: Colors.darkGreen}}>
                {UserForm.userEmail}
              </Text>
            </View>
          </View>
        </View>
        <SettingList {...settingsData} />
        <SettingList {...otherData} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    backgroundColor: Colors.white,
    width: '90%',
    height: 115,
    paddingHorizontal: 25,
    paddingVertical: 20,
    alignSelf: 'center',
    borderRadius: 20,
  },
  userInfoStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userImageContainer: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderColor: Colors.borderGrey,
    borderWidth: 2,
    backgroundColor: Colors.borderGrey,
  },
});

export default SettingScreen;
