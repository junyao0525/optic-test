import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {Colors, TextStyle} from '../themes';

type Props = {
  variant?: string;
  onPress: () => void;
  title: string;
};

const Button = (props: Props) => {
  return (
    <Pressable style={styles.fbContainer} onPress={props.onPress}>
      <Text style={[TextStyle.H3B, styles.title]}>{props.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fbContainer: {
    backgroundColor: Colors.blue,
    height: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
  },
});
export default Button;
