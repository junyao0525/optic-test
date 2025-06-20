import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../themes';
import {FatigueDetectionApi} from '@vt/core/apis/app/python';

const {width} = Dimensions.get('window');

type Props = {
  successMessage: string;
  targetScreen: string;
  extraData?: FatigueDetectionApi['Response'];
};

const SuccessPage = ({successMessage, targetScreen, extraData}: Props) => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRedirect = () => {
    navigation.navigate(targetScreen as never);
  };

  const formatResultValue = (key: string, value: string) => {
    if (key === 'Predicted Fatigue Class') {
      return {
        text: value,
        color: value.toLowerCase().includes('fatigue') ? '#FF6B6B' : '#4ECDC4',
        icon: value.toLowerCase().includes('fatigue') ? '⚠️' : '✅',
      };
    }
    return {text: value, color: Colors.black || '#666', icon: null};
  };

  const getFatigueStatusColor = () => {
    if (!extraData) return '#4ECDC4';
    const fatigueClass = extraData['Predicted Fatigue Class']?.toLowerCase();
    return fatigueClass?.includes('fatigue') ? '#FF6B6B' : '#4ECDC4';
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        {/* Success Icon & Header */}
        <View
          style={[
            styles.headerCard,
            {borderLeftColor: getFatigueStatusColor()},
          ]}>
          <View style={styles.iconContainer}>
            <Text style={styles.successIcon}>🎯</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.successTitle}>Analysis Complete</Text>
            <Text style={styles.successSubtitle}>{successMessage}</Text>
          </View>
        </View>

        {/* Results Card */}
        {extraData && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsHeader}>
              📊 Fatigue Analysis Results
            </Text>

            {/* Primary Result - Fatigue Status */}
            <View
              style={[
                styles.primaryResult,
                {backgroundColor: getFatigueStatusColor() + '15'},
              ]}>
              <Text style={styles.primaryResultLabel}>Status</Text>
              <View style={styles.primaryResultValue}>
                <Text style={styles.primaryResultIcon}>
                  {
                    formatResultValue(
                      'Predicted Fatigue Class',
                      extraData['Predicted Fatigue Class'],
                    ).icon
                  }
                </Text>
                <Text
                  style={[
                    styles.primaryResultText,
                    {color: getFatigueStatusColor()},
                  ]}>
                  {extraData['Predicted Fatigue Class']}
                </Text>
              </View>
            </View>

            {/* Detailed Metrics */}
            <View style={styles.metricsGrid}>
              {Object.entries(extraData)
                .filter(([key]) => key !== 'Predicted Fatigue Class')
                .map(([key, value], index) => (
                  <View key={index} style={styles.metricCard}>
                    <Text style={styles.metricLabel}>{key}</Text>
                    <Text style={styles.metricValue}>{value}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleRedirect}
          activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>Continue</Text>
          <Text style={styles.actionButtonIcon}>→</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>
          Results generated on {new Date().toLocaleDateString()}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default SuccessPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor || '#f8f9fa',
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white || '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
  },
  iconContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.black || '#1a1a1a',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.black || '#666666',
    lineHeight: 22,
  },
  resultsContainer: {
    backgroundColor: Colors.white || '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black || '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryResult: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  primaryResultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black || '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  primaryResultValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryResultIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  primaryResultText: {
    fontSize: 20,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: Colors.backgroundColor || '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    width: '48%',
    minHeight: 70,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.black || '#666666',
    marginBottom: 4,
    lineHeight: 16,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black || '#1a1a1a',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: Colors.primary || '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 40,
    marginBottom: 20,
    shadowColor: Colors.primary || '#007AFF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: Colors.white || '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  actionButtonIcon: {
    color: Colors.white || '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: Colors.black || '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
