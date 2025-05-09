import {useEffect, useState} from 'react';
import {Dimensions, ScaledSize} from 'react-native';

export const useWindowDimension = () => {
  const [windowSize, setWindowSize] = useState<ScaledSize>(
    Dimensions.get('window'),
  );

  useEffect(() => {
    const onChange = ({window}: {window: ScaledSize}) => {
      setWindowSize(window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => {
      subscription.remove();
    };
  }, []);

  return windowSize; // returns {width, height, scale, fontScale}
};
