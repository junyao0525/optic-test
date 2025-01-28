import React, {ReactNode, useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Colors, TextStyle} from '../../themes';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';

const ColorVision = () => {
  const {navigate} = useNavigation();
  const {width, height} = useWindowDimensions();

  return (
    <View style={[styles.container, {width, minHeight: height}]}>
      <Text style={[TextStyle.H3, styles.text]}>Color Vision</Text>
      <Button title="test" onPress={() => {}} />
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
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '400',
    color: Colors.black,
  },
});

export default ColorVision;
