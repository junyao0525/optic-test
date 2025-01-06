import {StyleSheet} from 'react-native';

export const FontFamilies = {
  black: 'Nunito-Black',
  blackItalic: 'Nunito-BlackItalic',
  bold: 'Nunito-Bold',
  boldItalic: 'Nunito-BoldItalic',
  extraBold: 'Nunito-ExtraBold',
  extraBoldItalic: 'Nunito-ExtraBoldItalic',
  extraLight: 'Nunito-ExtraLight',
  extraLightItalic: 'Nunito-ExtraLightItalic',
  italic: 'Nunito-Italic',
  light: 'Nunito-Light',
  lightItalic: 'Nunito-LightItalic',
  medium: 'Nunito-Medium',
  mediumItalic: 'Nunito-MediumItalic',
  regular: 'Nunito-Regular',
  semiBold: 'Nunito-SemiBold',
  semiBoldItalic: 'Nunito-SemiBoldItalic',
} as const;

export const Colors = {
  backgroundColor: '#E0FFFF',
  primary: '#0099ff',
  orange: '#FF4000',
  darkGreen: '#2F4F4F',
  lightGreen: '#8FBC8F',
  lightCyan: '#E0FFFF',
  lightBlue: '#B0C4DE',
  blue: '#4682B4',
  black: '#000000',
  white: '#FFFFFF',
  borderGrey: '#E6E6E6',
};

export const TextStyle = StyleSheet.create({
  H1: {
    fontSize: 32,
    fontFamily: FontFamilies.regular,
  },
  H2: {
    fontSize: 28,
    fontFamily: FontFamilies.regular,
  },
  H3: {
    fontSize: 24,
    fontFamily: FontFamilies.regular,
  },
  H1B: {
    fontSize: 32,
    fontFamily: FontFamilies.bold,
  },
  H2B: {
    fontSize: 28,
    fontFamily: FontFamilies.bold,
  },
  H3B: {
    fontSize: 24,
    fontFamily: FontFamilies.bold,
  },
  P1: {
    fontSize: 18,
    fontFamily: FontFamilies.regular,
  },
  P2: {
    fontSize: 16,
    fontFamily: FontFamilies.regular,
  },
  P3: {
    fontSize: 14,
    fontFamily: FontFamilies.regular,
  },
  P1B: {
    fontSize: 18,
    fontFamily: FontFamilies.bold,
  },
  P2B: {
    fontSize: 16,
    fontFamily: FontFamilies.bold,
  },
  P3B: {
    fontSize: 14,
    fontFamily: FontFamilies.bold,
  },
});
