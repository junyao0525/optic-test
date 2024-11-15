import React from 'react';
import {
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

type ButtonDetail = {
  title: string;
  image: ImageSourcePropType;
};

const LandoltImage = require('../../assets/images/home/landolt.png');
const EyeTirednessImage = require('../../assets/images/home/eye-tiredness.png');
const ColorVisionImage = require('../../assets/images/home/color-vision.png');
const GraphImage = require('../../assets/images/home/graph-exp.png');

const buttonDetails: ButtonDetail[] = [
  {title: 'Landolt’s C Test', image: LandoltImage},
  {title: 'Eye Tiredness', image: EyeTirednessImage},
  {title: 'Color Vision', image: ColorVisionImage},
];

const HomeScreen = () => {
  const handleButtonPress = (title: string) => {
    console.log(`${title} button pressed`);
  };

  return (
    <>
      <Header backButton={false} title={'Home'} />
      <ScrollView style={styles.container} scrollEnabled={false}>
        <Card title="Overview">
          {/**Hard code for Image */}
          <Image
            style={styles.image}
            resizeMode="contain"
            source={GraphImage}
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
                onPress={() => handleButtonPress(item.title)}
                image={item.image}
              />
            )}
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
