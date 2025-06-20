import React, {ReactNode, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {useWindowDimension} from '../hooks/useWindowDimension';
import {Colors, TextStyle} from '../themes';

const SplashScreen = ({children}: {children: ReactNode}) => {
  const [show, setShow] = useState(true);
  const {width, height} = useWindowDimension();
  const {t} = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2000);
  }, []);

  if (show) {
    return (
      <View style={[styles.container, {width, minHeight: height}]}>
        <Text style={[TextStyle.H2B, styles.text]}>{t('splash.app_name')}</Text>
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
    color: Colors.black,
  },
});

export default SplashScreen;
