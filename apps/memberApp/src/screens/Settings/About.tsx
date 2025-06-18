import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import LandoltInfoCard from '../../components/LandoltInfoCard';
import { Colors } from '../../themes';

const PlaceholderScreen: React.FC<{title: string}> = ({title}) => (
  <View style={styles.scene}>
    <Text style={styles.text}>{title} Content Goes Here</Text>
  </View>
);

const About = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [showLandoltInfo, setShowLandoltInfo] = useState(false);
  const [showEyeTiredness, setShowEyeTiredness] = useState(false);

  const handleLandoltInfo = () => {
    setShowLandoltInfo(true);
  };

  const handleEyeTiredness = () => {
    setShowEyeTiredness(true);
  };

  const closeLandoltInfo = () => {
    setShowLandoltInfo(false);
  };

  const closeEyeTiredness = () => {
    setShowEyeTiredness(false);
  };

  return (
    <View style={styles.container}>
      <Header title={t('settings.about')} backButton />
      
      <View style={styles.content}>
        <Text style={styles.title}>{t('settings.vision_test_info')}</Text>
        <Text style={styles.subtitle}>{t('settings.learn_more')}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLandoltInfo}>
            <Text style={styles.buttonIcon}>👁️</Text>
            <Text style={styles.buttonTitle}>{t('settings.landolt_c_test')}</Text>
            <Text style={styles.buttonSubtitle}>{t('settings.visual_acuity_measurement')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleEyeTiredness}>
            <Text style={styles.buttonIcon}>😴</Text>
            <Text style={styles.buttonTitle}>{t('settings.eye_tiredness')}</Text>
            <Text style={styles.buttonSubtitle}>{t('settings.fatigue_detection')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Landolt Info Modal */}
      <Modal
        visible={showLandoltInfo}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <LandoltInfoCard onClose={closeLandoltInfo} showCloseButton={true} />
      </Modal>

      {/* Eye Tiredness Modal */}
      <Modal
        visible={showEyeTiredness}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <Header title={t('settings.eye_tiredness_info')} backButton />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('settings.eye_tiredness_test')}</Text>
            <Text style={styles.modalText}>
              {t('settings.eye_tiredness_description')}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeEyeTiredness}>
              <Text style={styles.closeButtonText}>{t('settings.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    width: '100%',
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: Colors.darkGreen,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.darkGreen,
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  closeButton: {
    backgroundColor: Colors.darkGreen,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default About;
