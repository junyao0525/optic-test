import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type TestCardProps = {
  title: string;
  image: ImageProps;
  onPress: () => void;
  gradient: [string, string];
  icon: string;
};

const TestCard: React.FC<TestCardProps> = ({
  title,
  image,
  onPress,
  gradient,
  icon,
}) => {
  const {t} = useTranslation();

  return (
    <>
      <TouchableOpacity
        style={styles.testCard}
        onPress={onPress}
        activeOpacity={0.8}>
        <View style={[styles.cardContent, {backgroundColor: gradient[0]}]}>
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.testImage} resizeMode="contain" />
            <View style={[styles.iconOverlay, {backgroundColor: gradient[1]}]}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{t('landolt.tap_to_start')}</Text>
        </View>
      </TouchableOpacity>
    </>
  )
};

const styles = StyleSheet.create({
  testCard: {
    marginHorizontal: 4,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    transform: [{scale: 1}],
  },
  cardContent: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'space-between',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  testImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  iconText: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    opacity: 0.8,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TestCard;
