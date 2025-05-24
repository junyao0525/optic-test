import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Button from '../../components/Button';
import DistanceMeasurement from '../../components/DistanceMeasurement';
import {Colors, TextStyle} from '../../themes';

const LandoltC = () => {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();

  const [showDistanceMeasurement, setShowDistanceMeasurement] = useState(false);

  const handleButtonPress = useCallback(() => {
    navigation.navigate('LandoltInstruction', {eye: 'left'});
  }, [navigation]);

  return (
    <>
      {showDistanceMeasurement ? (
        <DistanceMeasurement handleButtonPress={handleButtonPress} />
      ) : (
        <>
          <View style={[styles.container, {width, minHeight: height}]}>
            <Text style={[TextStyle.H3, styles.text]}>
              Let's start with measuring the distance
            </Text>
            <Button
              title="Proceed"
              onPress={() => {
                setShowDistanceMeasurement(true);
              }}
            />
          </View>
        </>
      )}
    </>
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

export default LandoltC;
