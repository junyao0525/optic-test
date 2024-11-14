import React, {useCallback} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../themes';

const HomeScreen = () => {
  const handleOnPress = useCallback(() => {
    console.log('button pressed');
  }, []);

  return (
    <View style={[styles.container]}>
      <Text>HomeScreen</Text>
      <Button onPress={handleOnPress} title="buwwwtton" color={Colors.orange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BackgroundColor,
  },
});

export default HomeScreen;
