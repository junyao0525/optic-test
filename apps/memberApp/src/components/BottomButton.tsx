import {ReactNode} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Colors} from '../themes';

const BottomButton = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
}: {
  title: ReactNode;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, buttonStyle]}
          onPress={onPress}>
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.blue,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
  },
  buttonContainer: {
    borderRadius: 5,
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    width: '100%',
    height: 70,
    backgroundColor: Colors.white, // Replace with Colors.White
  },
});

export default BottomButton;
