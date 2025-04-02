import React from 'react';
import {StyleSheet, View} from 'react-native';
import Header from '../../components/Header';
import {Colors} from '../../themes';

const Help = () => {
  return (
    <View style={styles.container}>
      <Header title={'Help'} backButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    width: '100%',
  },
});

export default Help;
