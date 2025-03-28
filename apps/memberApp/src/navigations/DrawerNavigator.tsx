import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Divider from '../components/Divider';
import {Colors} from '../themes';
import StackNavigator from './StackNavigator';

type User = {
  UserName: string;
  userEmail: string;
  userImage: string;
};

const Drawer = createDrawerNavigator();

const iconMapping: Record<string, string> = {
  Home: 'home-outline',
  History: 'stats-chart-outline',
  Setting: 'settings-outline',
};

const DrawerItemComponent = ({
  title,
  routeName,
}: {
  title: string;
  routeName: string;
}) => {
  const navigation = useNavigation(); // Hook for navigation
  const iconName = iconMapping[routeName] || 'help-circle-outline';

  return (
    <DrawerItem
      icon={({color, size}) => (
        <IonIcon name={iconName} size={size} color={color} />
      )}
      label={title}
      onPress={() => navigation.navigate(routeName as never)}
    />
  );
};

const CustomDrawerContent = (props: any) => {
  console.log('Current Routes:', props.state.routes); // Debugging

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Header Section */}
      <View style={{paddingVertical: 20, paddingHorizontal: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Image
            source={require('../../assets/images/person.png')}
            style={{
              width: 75,
              height: 75,
              borderRadius: 37.5,
              borderColor: Colors.borderGrey,
              borderWidth: 2,
              backgroundColor: Colors.borderGrey,
            }}
          />
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>John Doe</Text>
            <Text style={{fontSize: 14, fontWeight: 'bold'}}>
              JohnDoe@gmail.com
            </Text>
          </View>
        </View>
      </View>
      <Divider />
      {/* Drawer Items List */}
      <DrawerContentScrollView {...props}>
        {[
          {title: 'Home', route: 'Home'},
          {title: 'History', route: 'History'},
          {title: 'Settings', route: 'Setting'},
        ].map(({title, route}) => (
          <DrawerItemComponent key={route} title={title} routeName={route} />
        ))}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{headerShown: false}}>
      {/* HomeStack (includes bottom tab navigation inside StackNavigator) */}
      <Drawer.Screen
        name="HomeStack"
        component={StackNavigator}
        options={{title: 'Home'}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
