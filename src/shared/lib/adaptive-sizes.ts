import { Dimensions, PixelRatio } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// адаптив по референсу размеров iPhone X (375x812), как в дизайне Figma
export const wp = (width: number) => {
  'worklet';
  return PixelRatio.roundToNearestPixel(
    (screenWidth * ((width / 375) * 100)) / 100,
  );
};

export const hp = (height: number) => {
  'worklet';
  return PixelRatio.roundToNearestPixel(
    (screenHeight * ((height / 812) * 100)) / 100,
  );
};
