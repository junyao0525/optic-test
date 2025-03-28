import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, {useRef} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import HistoryScreen from '../screens/Historys';
import HomeScreen from '../screens/Home';
import SettingScreen from '../screens/Settings';
import {Colors, TextStyle} from '../themes';

export const tabHeight = 64;
const Tab = createBottomTabNavigator();

const iconMapping: Record<string, {name: string; iconSet: 'Ionicons'}> = {
  Home: {name: 'home-outline', iconSet: 'Ionicons'},
  Test: {name: 'eye-outline', iconSet: 'Ionicons'},
  History: {name: 'stats-chart-outline', iconSet: 'Ionicons'},
  Setting: {name: 'settings-outline', iconSet: 'Ionicons'},
};

const renderIcon = (
  iconName: string,
  iconSet: string,
  color: string,
  size: number,
) => {
  switch (iconSet) {
    case 'Ionicons':
      return <IonIcon name={iconName} size={size} color={color} />;
    default:
      return <Icon name="question-circle" size={size} color={color} />; // Default icon if none match
  }
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
  const {name: iconName, iconSet} = iconMapping[routerName] || {
    name: 'question-circle',
    iconSet: 'FontAwesome',
  };

  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      {renderIcon(
        iconName,
        iconSet,
        selected ? Colors.lightBlue : Colors.black,
        30,
      )}
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

export default TabNavigator;
