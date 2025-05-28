import {useMemo} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureType,
} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {Colors} from '../themes';
import {Direction} from '../utils/logMar';
import Header from './Header';

type LandoltCardProps = {
  step: string;
  eye: 'LEFT' | 'RIGHT';
  title: string;
  subTitle?: string;
  instruction: string;
  gesture?: GestureType; // Replace with your actual type
  onSwipe: (direction: Direction) => void;
  getLandoltCStyle: () => object; // Function to get the style of the Landolt C
  children?: React.ReactNode;
};

const LandoltCard: React.FC<LandoltCardProps> = ({
  step,
  eye,
  title,
  subTitle,
  instruction,
  gesture,
  onSwipe,
  getLandoltCStyle,
  children,
}) => {
  const swipeGesture = useMemo(() => {
    return Gesture.Pan()
      .activateAfterLongPress(0)
      .onEnd(e => {
        'worklet';
        const {translationX, translationY} = e;

        let detectedDirection: Direction;

        if (Math.abs(translationX) > Math.abs(translationY)) {
          detectedDirection = translationX > 0 ? 'right' : 'left';
        } else {
          detectedDirection = translationY > 0 ? 'down' : 'up';
        }

        runOnJS(onSwipe)(detectedDirection);
      });
  }, [onSwipe]);

  return (
    <>
      <Header backHomeButton title="Landolt C Test" />
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {subTitle && <Text style={styles.title}>{subTitle}</Text>}

        <View style={styles.testInfo}>
          <Text style={styles.eyeIndicator}>
            Testing: {eye} eye (
            {eye === 'LEFT' ? 'cover right eye' : 'cover left eye'})
          </Text>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>{instruction}</Text>
        </View>

        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={styles.testArea}>
            <View style={getLandoltCStyle()} />
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  testInfo: {
    width: '90%',
    marginBottom: 20,
  },
  eyeIndicator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.darkGreen,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  instructionContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: Colors.darkGreen,
    borderRadius: 8,
    width: '90%',
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.white,
  },
  testArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '40%',
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  instructionPanel: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  instructionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.darkGreen,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#444',
  },
  startButton: {
    backgroundColor: Colors.darkGreen,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.darkGreen,
  },
  eyeResultContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  eyeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  acuityValue: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  acuityDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGreen,
    marginTop: 5,
  },
  disclaimer: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    marginVertical: 15,
  },
  resetButton: {
    backgroundColor: Colors.darkGreen,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
});

export default LandoltCard;
