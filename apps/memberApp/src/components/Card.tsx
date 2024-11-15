import React, {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, TextStyle} from '../themes';

// type CardSize = 'normal' | 'large';

const Card = ({title, children}: {title?: string; children: ReactNode}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={[TextStyle.H3B, styles.text]}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'column',
    color: Colors.white,
    height: 230,
    borderRadius: 20,
    margin: 20,
    marginTop: 5,
    paddingHorizontal: 25,
  },
  text: {
    paddingVertical: 10,
    alignContent: 'center',
    textAlign: 'center',
  },
});

export default Card;
