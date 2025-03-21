// import {createDrawerNavigator} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors, TextStyle} from '../themes';

const Header = ({
  backButton = false,
  menuButton = false,
  title,
}: {
  backButton?: boolean;
  menuButton?: boolean;
  title: string;
}) => {
  const navigation = useNavigation();
  const onBack = useCallback(() => {}, []);
  const onClick = useCallback(() => {
    // () => navigation.getParent('LeftDrawer').openDrawer();
  }, []);

  return (
    <View style={styles.container}>
      {backButton && (
        <TouchableOpacity onPress={onBack}>
          <Icon size={30} name="chevron-left" color={Colors.darkGreen} />
        </TouchableOpacity>
      )}

      {menuButton && (
        <TouchableOpacity onPress={onClick}>
          <MaterialIcon size={30} name="menu" color={Colors.darkGreen} />
        </TouchableOpacity>
      )}
      <Text style={[TextStyle.H3B, styles.text]}>{title}</Text>
    </View>
  );
};

// const LeftDrawer = () => {
//   const LeftDrawer = createDrawerNavigator();
//   return (
//     <LeftDrawer.Navigator screenOptions={{drawerPosition: 'left'}}>
//       <LeftDrawer.Screen name="Home" component={HomeScreen} />
//     </LeftDrawer.Navigator>
//   );
// };

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flexDirection: 'row',
    height: 100,
    alignContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 20,
  },
  text: {
    color: Colors.black,
  },
});
export default Header;
