import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useWindowDimension } from '../../hooks/useWindowDimension';
import Card from '../components/Card';
import Header from '../components/Header';
import TypeButton from '../components/TypeButton';
import { Colors, TextStyle } from '../themes';

// const {t} = useTranslation();

type ButtonDetail = {
  title: string;
  image: ImageSourcePropType;
  route: string;
  param?: {screen: string};
};

const LandoltImage = require('../../assets/images/home/landolt.png');
const EyeTirednessImage = require('../../assets/images/home/eye-tiredness.png');
const ColorVisionImage = require('../../assets/images/home/color-vision.png');
const AudioTestImage = require('../../assets/images/home/voice-detection.png');


const historyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      data: [Math.random(), Math.random(), Math.random(), Math.random()],
    },
  ],
};
const HomeScreen = () => {
  
  const {navigate} = useNavigation();
  const {t} = useTranslation();
  const {width} = useWindowDimension();

  const buttonDetails: ButtonDetail[] = [
    {
      title: t('common.landoltTest'),
      image: LandoltImage,
      route: 'CameraScreen',
      param: {screen: 'LandoltC'},
    },
    {
      title: t('common.eyeTiredness'),
      image: EyeTirednessImage,
      route: 'EyeTiredness',
    },
    {title: t('common.colorVision'), image: ColorVisionImage, route: 'ColorVision'},
    {title: t('common.speakTest'), image: AudioTestImage, route: 'AudioTest'},
  ];
  const handleButtonPress = (route: string, param?: {screen: string}) => {
    navigate(route, param);
    console.log(`${route} button pressed`);
  };

  return (
    <>
      <Header title={t('home.title')} menuButton />
      <ScrollView style={styles.container}>
        <Card title="Overview">
          <LineChart
            data={historyData}
            width={width - 90}
            height={180}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: Colors.white,
              backgroundGradientFrom: Colors.white,
              backgroundGradientTo: Colors.white,
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: Colors.white,
              },
            }}
            bezier
            style={{
              borderRadius: 16,
            }}
          />
        </Card>
        <Text style={[TextStyle.H1B, styles.textTypes]}>
          {t('home.testTypes')}
        </Text>
        <View>
          <FlatList
            data={buttonDetails}
            keyExtractor={item => item.title}
            renderItem={({item}) => (
              <TypeButton
                title={item.title}
                onPress={() => handleButtonPress(item.route)}
                image={item.image}
              />
            )}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  textTypes: {
    alignContent: 'center',
    textAlign: 'center',
    paddingVertical: 5,
    color: Colors.darkGreen,
  },
  image: {
    borderColor: Colors.black,
    right: 14,
  },
});

export default HomeScreen;
