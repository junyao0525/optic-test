import {
    createDrawerNavigator,
    DrawerContentScrollView
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../providers/AuthProvider';
import { Colors, TextStyle } from '../themes';
import StackNavigator from './StackNavigator';

const Drawer = createDrawerNavigator();

const iconMapping: Record<string, {name: string; color: string}> = {
  Home: {name: 'home-outline', color: Colors.blue},
  History: {name: 'stats-chart-outline', color: Colors.lightBlue},
  Setting: {name: 'settings-outline', color: Colors.orange},
};

const DrawerItemComponent = ({
  title,
  routeName,
  isSelected,
}: {
  title: string;
  routeName: string;
  isSelected?: boolean;
}) => {
  const navigation = useNavigation();
  const {name, color} = iconMapping[routeName] || {
    name: 'help-circle-outline',
    color: Colors.black,
  };

  return (
    <TouchableOpacity
      style={[styles.drawerItem, isSelected && styles.selectedDrawerItem]}
      onPress={() => navigation.navigate(routeName as never)}>
      <View style={[styles.iconContainer, {backgroundColor: color + '20'}]}>
        <Icon name={name} size={24} color={color} />
      </View>
      <Text style={[styles.drawerItemText, isSelected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const CustomDrawerContent = (props: any) => {
  const {t} = useTranslation();
  const {user} = useAuth();
  const currentRoute = props.state.routes[props.state.index];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/images/person.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {user?.name || 'Guest User'}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || 'Sign in to sync your data'}
            </Text>
          </View>
        </View>
      </View>

      {/* Drawer Items List */}
      <DrawerContentScrollView
        {...props}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Main</Text> */}
          {[
            {title: t("common.home"), route: 'Home'},
            {title: t("common.history"), route: 'History'},
            {title: t("common.setting"), route: 'Setting'},
          ].map(({title, route}) => (
            <DrawerItemComponent
              key={route}
              title={title}
              routeName={route}
              isSelected={currentRoute.name === route}
            />
          ))}
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: Colors.white,
          width: '85%',
        },
        drawerType: 'slide',
      }}>
      <Drawer.Screen
        name="HomeStack"
        component={StackNavigator}
        options={{title: 'Home'}}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGrey,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
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
    ...TextStyle.P2,
    color: Colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...TextStyle.P2B,
    color: Colors.borderGrey,
    marginLeft: 20,
    marginBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  selectedDrawerItem: {
    backgroundColor: Colors.backgroundColor,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  drawerItemText: {
    ...TextStyle.P1B,
    color: Colors.black,
  },
  selectedText: {
    color: Colors.primary,
  },
});

export default DrawerNavigator;
