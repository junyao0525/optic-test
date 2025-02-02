import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {Colors, TextStyle} from '../themes';

type Props = {
  variant?: string;
  onPress: () => void;
  title: string;
  containerStyle?: any;
  textStyle?: any;
};

const Button = (props: Props) => {
  return (
    <Pressable
      style={props.containerStyle ? props.containerStyle : styles.fbContainer}
      onPress={props.onPress}>
      <Text
        style={
          props.textStyle ? props.textStyle : [TextStyle.P2, styles.title]
        }>
        {props.title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fbContainer: {
    backgroundColor: Colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    color: Colors.white,
  },
});

export default Button;
