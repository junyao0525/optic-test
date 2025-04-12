import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import SettingList from '../../components/SettingList';
import {Colors, TextStyle} from '../../themes';

const personImage = require('../../../assets/images/person.png');

export type User = {
  userName: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  userImage: string;
  userDOB: string;
};

const UserForm: User = {
  // userName: 'John Doe',
  // firstName: 'John',
  // lastName: 'Doe',
  // userEmail: 'JohnDoe@gmail.com',
  // userImage: personImage,
  // userDOB: '3/12/1995',
  userName: '',
  firstName: '',
  lastName: '',
  userEmail: '',
  userImage: personImage,
  userDOB: '',
};

const SettingScreen = () => {
  const navigation = useNavigation();
  const [userForm, setUserForm] = useState(UserForm);

  const settingsData = {
    title: 'Personal Data',
    items: [
      {
        title: 'My Profile',
        icon: 'person-circle',
        onPress: () => navigation.navigate('Profile'),
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
              source={userForm.userImage}
              style={styles.userImageContainer}
            />
            <View>
              {userForm.userName ? (
                <>
                  <Text style={{...TextStyle.H3B, color: Colors.black}}>
                    {userForm.userName}
                  </Text>
                  <Text style={{...TextStyle.P1B, color: Colors.darkGreen}}>
                    {userForm.userEmail}
                  </Text>
                </>
              ) : (
                <View>
                  <Text style={{...TextStyle.H3B, color: Colors.black}}>
                    Guess
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{
                      width: 100,
                      height: 30,
                      backgroundColor: Colors.red,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={(TextStyle.P1B, styles.login)}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  login: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default SettingScreen;
