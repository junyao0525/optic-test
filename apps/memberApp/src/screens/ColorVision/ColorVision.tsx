import React from 'react';
import {StyleSheet, Text, View, Image, useWindowDimensions} from 'react-native';
import {Colors, TextStyle} from '../../themes';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';

const ColorVisionImage = require('../../../assets/images/home/color-vision.png');
const ColorVision = () => {
  const {navigate} = useNavigation();
  const {width, height} = useWindowDimensions();
  return (
    <View style={[styles.container, {width, minHeight: height}]}>
      <Image source={ColorVisionImage} style={styles.image} />
      <Text style={[TextStyle.H3, styles.text]}>Color Vision Test</Text>

      <View style={styles.gridContainer}>
        <Button
          title="1"
          onPress={() => {}}
          containerStyle={styles.buttonContainer}
          textStyle={TextStyle.H1B}
        />
        <Button
          title="2"
          onPress={() => {}}
          containerStyle={styles.buttonContainer}
          textStyle={TextStyle.H1B}
        />
        <Button
          title="3"
          onPress={() => {}}
          containerStyle={styles.buttonContainer}
          textStyle={TextStyle.H1B}
        />
        <Button
          title="4"
          onPress={() => {}}
          containerStyle={styles.buttonContainer}
          textStyle={TextStyle.H1B}
        />
      </View>
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '400',
    color: Colors.black,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  buttonContainer: {
    width: '30%',
    backgroundColor: Colors.lightBlue,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ColorVision;
