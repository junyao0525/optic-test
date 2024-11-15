import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors, TextStyle} from '../themes';

const Header = ({
  backButton = false,
  title,
}: {
  backButton: boolean;
  title: string;
}) => {
  const onBack = useCallback(() => {}, []);
  const onClick = useCallback(() => {}, []);

  return (
    <View style={styles.container}>
      {backButton && (
        <Pressable onPress={onBack}>
          <Icon size={30} name="chevron-left" color={Colors.darkGreen} />
        </Pressable>
      )}

      <Pressable onPress={onClick}>
        <MaterialIcon size={30} name="menu" color={Colors.darkGreen} />
      </Pressable>
      <Text style={[TextStyle.H3B, styles.text]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flexDirection: 'row',
    height: 65,
    alignContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 20,
  },
  text: {},
});
export default Header;
