import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Pressable, Text, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../themes'; // Ensure you have a Colors file for theming

const tabItems = [
  {label: 'Home', iconName: 'home-outline', route: 'Home'},
  {label: 'History', iconName: 'time-outline', route: 'History'},
  {label: 'Settings', iconName: 'settings-outline', route: 'Setting'},
];

const CustomTabContent = (
  {state, navigation}: BottomTabBarProps,
  props: any,
) => {
  return (
    <View style={styles.tabBarContainer}>
      {tabItems.map((item, index) => {
        const isActive = state.index === index;

        return (
          <Pressable
            key={index}
            style={[styles.tabItem, isActive && styles.activeTab]}
            onPress={() => navigation.navigate(item.route)}>
            <IonIcon
              name={item.iconName}
              size={24}
              color={isActive ? Colors.primary : Colors.black}
            />
            <Text style={[styles.tabText, isActive && {color: Colors.primary}]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = {
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGrey,
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: Colors.black,
  },
};

export default CustomTabContent;
