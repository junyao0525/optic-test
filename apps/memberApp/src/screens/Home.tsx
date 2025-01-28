import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import TypeButton from '../components/TypeButton';
import {Colors, TextStyle} from '../themes';
import {LineChart} from 'react-native-chart-kit';
import {useNavigation} from '@react-navigation/core';

type ButtonDetail = {
  title: string;
  image: ImageSourcePropType;
  route: string;
};

const LandoltImage = require('../../assets/images/home/landolt.png');
const EyeTirednessImage = require('../../assets/images/home/eye-tiredness.png');
const ColorVisionImage = require('../../assets/images/home/color-vision.png');
const GraphImage = require('../../assets/images/home/graph-exp.png');

const buttonDetails: ButtonDetail[] = [
  {title: 'Landolt’s C Test', image: LandoltImage, route: 'LandoltC'},
  {title: 'Eye Tiredness', image: EyeTirednessImage, route: 'EyeTiredness'},
  {title: 'Color Vision', image: ColorVisionImage, route: 'ColorVision'},
];
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
  const handleButtonPress = (route: string) => {
    navigate(route as never);
    console.log(`${route} button pressed`);
  };

  return (
    <>
      <Header title={'Home'} menuButton />
      <ScrollView style={styles.container}>
        <Card title="Overview">
          {/**Hard code for Image */}
          <LineChart
            data={historyData}
            width={Dimensions.get('window').width - 90}
            height={180}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: 'rgb(255, 255, 255)',
              backgroundGradientFrom: 'rgb(255, 255, 255)',
              backgroundGradientTo: 'rgb(255, 255, 255)',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: 'rgb(255, 255, 255) ',
              },
            }}
            bezier
            style={{
              borderRadius: 16,
            }}
          />
        </Card>
        <Text style={[TextStyle.H1B, styles.textTypes]}>Test Types</Text>
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
