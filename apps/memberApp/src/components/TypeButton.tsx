import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import {Colors, TextStyle} from '../themes';

type TypeButtonProps = {
  onPress: () => void;
  title: string;
  image: ImageSourcePropType;
};

const TypeButton = (props: TypeButtonProps) => {
  return (
    <Pressable style={styles.fbContainer} onPress={props.onPress}>
      <Text style={[TextStyle.H3B, styles.title]}>{props.title}</Text>
      <Image source={props.image} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fbContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.lightBlue,
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 25,
  },
  title: {
    textAlign: 'left',
  },
});
export default TypeButton;
