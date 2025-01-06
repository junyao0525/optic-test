import React, {ReactNode, useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Colors, TextStyle} from '../../themes';
import Button from '../../components/Button';

const LandoltMain = () => {
  const {width, height} = useWindowDimensions();

  return (
    <View style={[styles.container, {width, minHeight: height}]}>
      <Text style={[TextStyle.H2B, styles.text]}>
        Let’s start with measuring the distance
      </Text>
      <Button
        title="Proceed"
        onPress={() => {
          console.log('proceed');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  text: {
    fontWeight: 'bold',
    color: Colors.black,
  },
});

export default LandoltMain;
