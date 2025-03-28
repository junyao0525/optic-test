import React from 'react';
import {StyleSheet, View} from 'react-native';

const Divider = ({
  color = '#B0BEC5',
  thickness = 2,
  marginVertical = 10,
  ...rest
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical,
          ...rest,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

export default Divider;
