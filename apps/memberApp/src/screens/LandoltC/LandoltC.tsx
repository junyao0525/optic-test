import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import Button from '../../components/Button';
import DistanceMeasurement from '../../components/DistanceMeasurement';
import {useWindowDimension} from '../../hooks/useWindowDimension';
import {Colors, TextStyle} from '../../themes';

const LandoltC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const {width, height} = useWindowDimension();

  const [showDistanceMeasurement, setShowDistanceMeasurement] = useState(false);

  const handleButtonPress = useCallback(() => {
    navigation.navigate('AudioScreen');
  }, [navigation]);

  const {t} = useTranslation();

  return (
    <>
      {showDistanceMeasurement ? (
        <DistanceMeasurement handleButtonPress={handleButtonPress} />
      ) : (
        <>
          <View style={[styles.container, {width, minHeight: height}]}>
            <Text style={[TextStyle.H3, styles.text]}>
              {t('landolt.start')}
            </Text>
            <Button
              title={t('landolt.proceed')}
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
