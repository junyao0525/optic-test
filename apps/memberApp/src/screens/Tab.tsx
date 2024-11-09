import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, {useMemo, useRef} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors, TextStyle} from '../themes';
import HomeScreen from './Home';
import MeScreen from './Me';
import UnKnownScreen from './Unknown';

export const tabHeight = 64;
const Tab = createBottomTabNavigator();

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
  routerName: ReactNavigation.TabParamListKey;
  onPress: () => void;
}) => {
  const iconName = useMemo(() => {
    if (routerName === 'Home') {
      return 'home';
    } else if (routerName === 'UnKnown') {
      return 'user';
    } else if (routerName === 'Me') {
      return 'user';
    }
    return 'home';
  }, [routerName]);

  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      <Icon
        name={iconName}
        size={30}
        color={selected ? Colors.lightBlue : Colors.black}
      />
      {showBadge && (
        <View style={styles.badgeContainer}>
          <Text style={[TextStyle.P3, styles.badgeText]}>{badgeNumber}</Text>
        </View>
      )}
      <Text
        style={[
          TextStyle.P2,
          styles.tabItemText,
          selected && {
            color: Colors.black,
          },
        ]}
        numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
};

const TabBar = (props: BottomTabBarProps) => {
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
          title={route.name as ReactNavigation.TabParamListKey}
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

const TabScreen = () => {
  const tabBar = useRef((props: BottomTabBarProps) => (
    <TabBar {...props} />
  )).current;
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={tabBar}
        sceneContainerStyle={{
          backgroundColor: Colors.BackgroundColors,
        }}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="UnKnown" component={UnKnownScreen} />
        <Tab.Screen name="Me" component={MeScreen} />
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
  },
  tabItem: {
    paddingTop: 13,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 'auto',
    padding: 0,
    flex: 1,
    gap: 2,
  },
  tabItemText: {
    textAlign: 'center',
    fontWeight: '400',
    color: Colors.black,
  },
  badgeContainer: {
    position: 'absolute',
    top: 6,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
  },
});

export default TabScreen;
