import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useWindowDimension} from '../../hooks/useWindowDimension';
import {Colors, TextStyle} from '../themes';

// Type the navigation prop to use the correct type
type TabParamList = {
  Home: undefined;
  History: undefined;
  Settings: undefined;
};

const Header = ({
  backButton = false,
  menuButton = false,
  backHomeButton = false,
  title,
  headerColor,
}: {
  backButton?: boolean;
  menuButton?: boolean;
  backHomeButton?: boolean;
  title?: string;
  headerColor?: string;
}) => {
  const {height} = useWindowDimension();
  const navigation = useNavigation<NavigationProp<TabParamList>>();

  const onBack = useCallback(() => {
    navigation.goBack(); // Go back to the previous screen
  }, [navigation]);

  const onBackHome = useCallback(() => {
    navigation.navigate('Home'); // Navigate to the 'Home' screen
  }, [navigation]);

  const onClickMenu = useCallback(() => {
    if ('openDrawer' in navigation) {
      (navigation as any).openDrawer(); // Open the drawer if applicable
    } else {
      console.warn('openDrawer is not available on the navigation object');
    }
  }, [navigation]);

  return (
    <SafeAreaView>
      <View
        style={[
          {backgroundColor: headerColor || Colors.backgroundColor},
          styles.container,
          [{height: height / 9, paddingTop: height / 30}],
        ]}>
        {/* Back Home Button */}
        {backHomeButton && (
          <TouchableOpacity onPress={onBackHome}>
            <Icon size={24} name="chevron-left" color={Colors.darkGreen} />
          </TouchableOpacity>
        )}

        {/* Back Button */}
        {backButton && (
          <TouchableOpacity onPress={onBack}>
            <Icon size={24} name="chevron-left" color={Colors.darkGreen} />
          </TouchableOpacity>
        )}

        {/* Menu Button */}
        {menuButton && (
          <TouchableOpacity onPress={onClickMenu}>
            <MaterialIcon size={30} name="menu" color={Colors.darkGreen} />
          </TouchableOpacity>
        )}

        {/* Centered Title */}
        <View style={styles.center}>
          <Text style={[TextStyle.H3B, styles.text]}>{title}</Text>
        </View>

        {/* Empty space to maintain layout symmetry */}
        {/* {!backButton && !menuButton && !backHomeButton && (
          <View style={{flex: 1}} />
        )} */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    justifyContent: 'space-between', // Space between buttons and the title
  },
  text: {
    color: Colors.black,
    textAlign: 'center', // Ensures the title is centered
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
