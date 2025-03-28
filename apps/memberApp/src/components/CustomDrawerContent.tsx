import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import {Text, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const drawerItems = [
  {label: 'Home', iconName: 'home-outline', route: 'Home'},
  {label: 'History', iconName: 'time-outline', route: 'History'},
  {label: 'Settings', iconName: 'settings-outline', route: 'Setting'},
];

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header */}
      <View style={{padding: 20}}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Menu</Text>
      </View>

      {/* Map Over Array to Render Drawer Items */}
      {drawerItems.map((item, index) => (
        <DrawerItem
          key={index}
          icon={() => <IonIcon name={item.iconName} size={20} color="black" />}
          label={item.label}
          onPress={() => props.navigation.navigate(item.route)}
        />
      ))}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
