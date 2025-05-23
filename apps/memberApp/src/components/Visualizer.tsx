import React from 'react';
import {StyleSheet, View} from 'react-native';

interface VisualizerProps {
  levels: number[];
  color?: string;
  minHeight?: number;
  maxHeight?: number;
  barWidth?: number;
  barSpacing?: number;
}

const Visualizer: React.FC<VisualizerProps> = ({
  levels,
  color = '#4285F4',
  minHeight = 5,
  maxHeight = 80,
  barWidth = 4,
  barSpacing = 3,
}) => {
  // Normalize the audio levels based on min and max height
  const normalizedLevels = levels.map(
    level => minHeight + level * (maxHeight - minHeight),
  );

  return (
    <View style={styles.container}>
      {normalizedLevels.map((height, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height,
              backgroundColor: color,
              width: barWidth,
              marginHorizontal: barSpacing / 2,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  bar: {
    borderRadius: 50,
  },
});

export default Visualizer;
