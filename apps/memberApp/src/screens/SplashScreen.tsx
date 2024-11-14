import React, {ReactNode, useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Colors, TextStyle} from '../themes';

const SplashScreen = ({children}: {children: ReactNode}) => {
  const [show, setShow] = useState(true);
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2000);
  }, []);

  if (show) {
    return (
      <View style={[styles.container, {width, minHeight: height}]}>
        <Text style={[TextStyle.H2B, styles.text]}>OptiTest</Text>
      </View>
    );
  }
  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  text: {
    fontWeight: 'bold', // 700 , normal 400
    color: Colors.lightGrey,
  },
});

export default SplashScreen;
