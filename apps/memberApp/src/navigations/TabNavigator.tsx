import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HistoryScreen from '../screens/Historys';
import HomeScreen from '../screens/Home';
import SettingScreen from '../screens/Settings';
import { Colors, TextStyle } from '../themes';

export const tabHeight = 70;
const Tab = createBottomTabNavigator();

const iconMapping: Record<string, {name: string; activeName: string}> = {
  Home: {
    name: 'home-outline',
    activeName: 'home',
  },
  History: {
    name: 'stats-chart-outline',
    activeName: 'stats-chart',
  },
  Setting: {
    name: 'settings-outline',
    activeName: 'settings',
  },
};

const TabItem = ({
  title,
  selected,
  showBadge,
  badgeNumber,
  routerName,
  onPress,
}: {
  title: string;
  selected?: boolean;
  showBadge?: boolean;
  badgeNumber?: number;
  routerName: string;
  onPress: () => void;
}) => {
  const {name, activeName} = iconMapping[routerName] || {
    name: 'help-circle-outline',
    activeName: 'help-circle',
  };

  return (
    <Pressable
      style={[styles.tabItem, selected && styles.selectedTabItem]}
      onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon
          name={selected ? activeName : name}
          size={24}
          color={selected ? Colors.primary : Colors.darkGreen}
        />
        {showBadge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badgeNumber}</Text>
          </View>
        )}
      </View>
      <Text
        style={[
          styles.tabItemText,
          selected && styles.selectedTabItemText,
        ]}
        numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
};

const TabBar = (props: BottomTabBarProps) => {
  const {t} = useTranslation();
  
  const getTabTitle = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return t('common.home');
      case 'History':
        return t('common.history');
      case 'Setting':
        return t('common.setting');
      default:
        return routeName;
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          height: props.insets.bottom + tabHeight,
        },
      ]}>
      {props.state.routes.map((route, idx) => (
        <TabItem
          key={route.key}
          title={getTabTitle(route.name)}
          selected={idx === props.state.index}
          onPress={() => {
            props.navigation.navigate(route.name);
          }}
          routerName={route.name}
          showBadge={false}
          badgeNumber={1}
        />
      ))}
    </View>
  );
};

const TabNavigator = () => {
  const tabBar = useRef((props: BottomTabBarProps) => (
    <TabBar {...props} />
  )).current;
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={tabBar}
        sceneContainerStyle={{
          backgroundColor: Colors.backgroundColor,
        }}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Setting" component={SettingScreen} />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGrey,
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectedTabItem: {
    transform: [{scale: 1.05}],
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  tabItemText: {
    ...TextStyle.P2,
    color: Colors.darkGreen,
    textAlign: 'center',
  },
  selectedTabItemText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    ...TextStyle.P3,
    color: Colors.white,
    fontWeight: '600',
  },
});

export default TabNavigator;
