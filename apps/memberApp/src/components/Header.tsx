import {useNavigation} from '@react-navigation/native';
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
import {Colors, TextStyle} from '../themes';

const Header = ({
  backButton = false,
  menuButton = false,
  title,
}: // onClick,
// onBack,
{
  backButton?: boolean;
  menuButton?: boolean;
  title: string;
  // onClick?: () => void;
  // onBack?: () => void;
}) => {
  const navigation = useNavigation();
  const onBack = useCallback(() => {
    navigation.goBack();
  }, []);

  //not correct
  const onClick = useCallback(() => {
    if ('openDrawer' in navigation) {
      (navigation as any).openDrawer();
    } else {
      console.warn('openDrawer is not available on the navigation object');
    }
  }, []);

  return (
    <SafeAreaView>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flexDirection: 'row',
    height: 80,
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    alignItems: 'center',
    gap: 20,
  },
  text: {
    color: Colors.black,
  },
});
export default Header;
