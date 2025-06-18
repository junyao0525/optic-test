import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../themes';
const { width } = Dimensions.get('window');

interface LandoltInfoCardProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const LandoltInfoCard: React.FC<LandoltInfoCardProps> = ({
  onClose,
  showCloseButton = true,
}) => {
  const { t } = useTranslation();

  const infoSections = [
    {
      title: t('landolt.info.what_is_title'),
      content: t('landolt.info.what_is_content'),
      icon: '👁️',
    },
    {
      title: t('landolt.info.how_works_title'),
      content: t('landolt.info.how_works_content'),
      icon: '⚙️',
    },
    {
      title: t('landolt.info.test_types_title'),
      content: t('landolt.info.test_types_content'),
      icon: '🎯',
    },
    {
      title: t('landolt.info.results_title'),
      content: t('landolt.info.results_content'),
      icon: '📊',
    },
    {
      title: t('landolt.info.accuracy_title'),
      content: t('landolt.info.accuracy_content'),
      icon: '🎯',
    },
  ];

  const renderInfoSection = (section: any, index: number) => (
    <View key={index} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{section.icon}</Text>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <Text style={styles.sectionContent}>{section.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('landolt.info.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('landolt.info.subtitle')}
          </Text>
        </View>

        {/* Info Sections */}
        {infoSections.map(renderInfoSection)}

        {/* Key Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>{t('landolt.info.key_features')}</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔬</Text>
              <Text style={styles.featureText}>{t('landolt.info.feature_scientific')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>{t('landolt.info.feature_mobile')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>{t('landolt.info.feature_quick')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📈</Text>
              <Text style={styles.featureText}>{t('landolt.info.feature_track')}</Text>
            </View>
          </View>
        </View>

        {/* Test Process */}
        <View style={styles.processSection}>
          <Text style={styles.processTitle}>{t('landolt.info.test_process')}</Text>
          <View style={styles.processSteps}>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>{t('landolt.info.step_1')}</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>{t('landolt.info.step_2')}</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>{t('landolt.info.step_3')}</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>{t('landolt.info.step_4')}</Text>
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerTitle}>{t('landolt.info.disclaimer_title')}</Text>
          <Text style={styles.disclaimerText}>{t('landolt.info.disclaimer_content')}</Text>
        </View>
      </ScrollView>

      {/* Close Button */}
      {showCloseButton && onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>{t('landolt.info.close')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGreen,
    flex: 1,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  featuresSection: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGreen,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  processSection: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  processTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGreen,
    marginBottom: 16,
    textAlign: 'center',
  },
  processSteps: {
    gap: 16,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  disclaimerSection: {
    backgroundColor: '#fff3cd',
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: Colors.darkGreen,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LandoltInfoCard; 