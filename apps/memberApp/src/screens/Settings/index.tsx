import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { useAuth } from '../../providers/AuthProvider';
import { Colors, TextStyle } from '../../themes';

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
  const navigation = useNavigation<RootStackNavigationProp>();
  const {user, logout} = useAuth();
  const [userForm, setUserForm] = useState<User>(initialUserForm);
  const {t} = useTranslation();

  useEffect(() => {
    if (user) {
      setUserForm(prev => ({
        ...prev,
        userName: user.name || '',
        userEmail: user.email || '',
      }));
    }
  }, [user]);

  const renderSettingItem = (
    title: string,
    icon: string,
    onPress: () => void,
    color: string = Colors.lightGreen,
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, {backgroundColor: color + '20'}]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <Text style={styles.settingItemText}>{title}</Text>
      </View>
      <Icon name="chevron-forward" size={24} color={Colors.borderGrey} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title={t('settings.title')} menuButton />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <Image
              source={userForm.userImage || personImage}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              {userForm.userName ? (
                <>
                  <Text style={styles.userName}>{userForm.userName}</Text>
                  <Text style={styles.userEmail}>{userForm.userEmail}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.userName}>{t('settings.guest')}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.signInButton}>
                    <Text style={styles.signInText}>{t('settings.signIn')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Personal Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.personalData')}</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem(
              t('settings.profile'),
              'person-circle-outline',
              () => navigation.navigate('Profile'),
              Colors.blue,
            )}
            {renderSettingItem(
              t('settings.history'),
              'bar-chart-outline',
              () => navigation.navigate('Tab', {screen: 'History'}),
              Colors.lightBlue,
            )}
          </View>
        </View>

        {/* Other Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.other')}</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem(
              t('settings.language'),
              'language-outline',
              () => navigation.navigate('Language'),
              Colors.orange,
            )}
            {renderSettingItem(
              t('settings.help'),
              'help-circle-outline',
              () => navigation.navigate('Help'),
              Colors.green,
            )}
            {renderSettingItem(
              t('settings.about'),
              'information-circle-outline',
              () => navigation.navigate('About'),
              Colors.black,
            )}
            {renderSettingItem(
              t('settings.logout'),
              'log-out-outline',
              () => logout(),
              Colors.red,
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.lightGreen,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    ...TextStyle.H3B,
    color: Colors.black,
    marginBottom: 4,
  },
  userEmail: {
    ...TextStyle.P1B,
    color: Colors.darkGreen,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  signInText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    ...TextStyle.H3,
    color: Colors.black,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderGrey,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingItemText: {
    ...TextStyle.P1B,
    color: Colors.black,
  },
});

export default SettingScreen;
