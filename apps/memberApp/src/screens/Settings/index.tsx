import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import SettingList from '../../components/SettingList';
import {Colors, TextStyle} from '../../themes';
import {useAuth} from '../../providers/AuthProvider';

const personImage = require('../../../assets/images/person.png');

export type User = {
  userName: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  userImage: any;
  userDOB: string;
};

const initialUserForm: User = {
  userName: '',
  firstName: '',
  lastName: '',
  userEmail: '',
  userImage: personImage,
  userDOB: '',
};

const SettingScreen = () => {
  const navigation = useNavigation();
  const {user, logout} = useAuth();
  const [userForm, setUserForm] = useState<User>(initialUserForm);

  useEffect(() => {
    if (user) {
      setUserForm(prev => ({
        ...prev,
        userName: user.name || '',
        userEmail: user.email || '',
      }));
    }
  }, [user]);

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
    title: 'Other',
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
      {
        title: 'Log Out',
        icon: 'log-out-outline',
        onPress: () => logout(),
      },
    ],
    iconSize: 34,
    iconColor: Colors.lightGreen,
  };

  return (
    <View>
      <Header title="Setting" menuButton />
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoStyle}>
          <Image
            source={userForm.userImage || personImage}
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
                  Guest
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  style={styles.loginButton}>
                  <Text style={styles.login}>Sign In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
      <SettingList {...settingsData} />
      <SettingList {...otherData} />
    </View>
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
  loginButton: {
    width: 100,
    height: 30,
    backgroundColor: Colors.red,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default SettingScreen;
