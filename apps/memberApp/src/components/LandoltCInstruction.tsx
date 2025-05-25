import React, {useEffect, useState} from 'react';
import {Image, ImageProps, StyleSheet, Text, View} from 'react-native';
import {useWindowDimension} from '../../hooks/useWindowDimension';
import {Colors, TextStyle} from '../themes';
import BottomButton from './BottomButton';

const coverLeftImage = require('../../assets/images/cover-left.png');
const coverRightImage = require('../../assets/images/cover-right.png');

type messageType = {
  title: string;
  description: string;
  photo: ImageProps | null;
};

const LandoltInstruction = ({
  eye = 'left',
  onContinue = () => {},
}: {
  eye: string;
  onContinue?: () => void;
}) => {
  const {width, height} = useWindowDimension();
  const [message, setMessage] = useState<messageType>({
    title: '',
    description: '',
    photo: null,
  });

  console.log(eye);

  useEffect(() => {
    console.log(eye);
    if (eye === 'left') {
      setMessage({
        title: 'TESTING LEFT EYE',
        description: 'Please cover your left eye as the picture shown below.',
        photo: coverLeftImage,
      });
    } else {
      setMessage({
        title: 'TESTING RIGHT EYE',
        description: 'Please cover your right eye as the picture shown below.',
        photo: coverRightImage,
      });
    }
  }, [eye]);

  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.mainTitle, TextStyle.H1]}>{message.title}</Text>
        <Text style={[styles.title, TextStyle.H3]}>{message.description}</Text>
      </View>
      {message.photo && (
        <Image
          source={message.photo}
          style={{
            width: width,
            height: height * 0.65,
            justifyContent: 'center',
            backgroundColor: Colors.backgroundColor,
          }}
        />
      )}
      <BottomButton title="Continue" onPress={onContinue}></BottomButton>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.backgroundColor,
  },
  mainTitle: {
    paddingTop: 30,
    marginBottom: 20,
    color: Colors.darkGreen,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.black,
  },
});

export default LandoltInstruction;
