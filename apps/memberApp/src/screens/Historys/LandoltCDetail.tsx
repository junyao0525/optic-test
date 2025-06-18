import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LandoltController, LandoltTestResultResponse } from '../../api/LandoltC/controller';
import Header from '../../components/Header';
import { Colors } from '../../themes';

const { width } = Dimensions.get('window');

interface RouteParams {
  resultId: number;
}

const LandoltCDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { resultId } = route.params as RouteParams;
  
  const [testResult, setTestResult] = useState<LandoltTestResultResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestResult();
  }, [resultId]);

  const fetchTestResult = async () => {
    try {
      const result = await LandoltController.getTestResultById(resultId);
      console.log(result)
      if (result.success) {
        setTestResult(result.data);
      } else {
        Alert.alert('Error', 'Failed to load test result');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching test result:', error);
      Alert.alert('Error', 'Failed to load test result');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVisionStatus = (logMAR: number) => {
    if (logMAR <= 0.0) return { status: 'Excellent', color: '#4CAF50' };
    if (logMAR <= 0.3) return { status: 'Good', color: '#8BC34A' };
    if (logMAR <= 0.5) return { status: 'Fair', color: '#FF9800' };
    if (logMAR <= 1.0) return { status: 'Poor', color: '#F44336' };
    return { status: 'Very Poor', color: '#D32F2F' };
  };

  const getSnellenEquivalent = (logMAR: number) => {
    const snellenValues = {
      0.0: '20/20',
      0.1: '20/25',
      0.2: '20/32',
      0.3: '20/40',
      0.4: '20/50',
      0.5: '20/63',
      0.6: '20/80',
      0.7: '20/100',
      0.8: '20/125',
      0.9: '20/160',
      1.0: '20/200'
    };
    
    // Find closest match
    const keys = Object.keys(snellenValues).map(Number);
    const closest = keys.reduce((prev, curr) => 
      Math.abs(curr - logMAR) < Math.abs(prev - logMAR) ? curr : prev
    );
    
    return snellenValues[closest as keyof typeof snellenValues];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.darkGreen} />
        <Text style={styles.loadingText}>{t('landolt.detail.loading')}</Text>
      </View>
    );
  }

  if (!testResult) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('landolt.detail.error')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('landolt.detail.go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const leftEyeStatus = getVisionStatus(testResult.L_logMar);
  const rightEyeStatus = getVisionStatus(testResult.R_logMar);
  const leftSnellen = getSnellenEquivalent(testResult.L_logMar);
  const rightSnellen = getSnellenEquivalent(testResult.R_logMar);

  return (
    <View style={styles.container}>
      <Header title={t('landolt.detail.title')} backButton />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Test Information Header */}
        <View style={styles.headerCard}>
          <Text style={styles.testId}>Test #{testResult.id}</Text>
          <Text style={styles.testDate}>{formatDate(testResult.created_at)}</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userId}>{t('landolt.detail.user_id')} {testResult.user_id}</Text>
          </View>
        </View>

        {/* Overall Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>{t('landolt.detail.test_summary')}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('landolt.detail.average_score')}</Text>
              <Text style={styles.summaryValue}>
                {((testResult.L_score + testResult.R_score) / 2).toFixed(1)}/10
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('landolt.detail.average_logmar')}</Text>
              <Text style={styles.summaryValue}>
                {((testResult.L_logMar + testResult.R_logMar) / 2).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Left Eye Results */}
        <View style={styles.eyeCard}>
          <Text style={styles.eyeTitle}>{t('landolt.detail.left_eye_results')}</Text>
          <View style={styles.eyeContent}>
            <View style={styles.metricRow}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>{t('landolt.detail.score')}</Text>
                <Text style={styles.metricValue}>{testResult.L_score}/10</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>{t('landolt.detail.logmar')}</Text>
                <Text style={styles.metricValue}>{testResult.L_logMar}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>{t('landolt.detail.snellen')}</Text>
                <Text style={styles.metricValue}>{leftSnellen}</Text>
              </View>
            </View>
            
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>{t('landolt.detail.vision_status')}</Text>
              <View style={[styles.statusBadge, { backgroundColor: leftEyeStatus.color }]}>
                <Text style={styles.statusText}>{leftEyeStatus.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right Eye Results */}
        <View style={styles.eyeCard}>
          <Text style={styles.eyeTitle}>{t('landolt.detail.right_eye_results')}</Text>
          <View style={styles.eyeContent}>
            <View style={styles.metricRow}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>{t('landolt.detail.score')}</Text>
                <Text style={styles.metricValue}>{testResult.R_score}/10</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>{t('landolt.detail.logmar')}</Text>
                <Text style={styles.metricValue}>{testResult.R_logMar}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>{t('landolt.detail.snellen')}</Text>
                <Text style={styles.metricValue}>{rightSnellen}</Text>
              </View>
            </View>
            
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>{t('landolt.detail.vision_status')}</Text>
              <View style={[styles.statusBadge, { backgroundColor: rightEyeStatus.color }]}>
                <Text style={styles.statusText}>{rightEyeStatus.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Visual Comparison */}
        <View style={styles.comparisonCard}>
          <Text style={styles.sectionTitle}>{t('landolt.detail.eye_comparison')}</Text>
          <View style={styles.comparisonChart}>
            <View style={styles.chartBar}>
              <Text style={styles.chartLabel}>{t('landolt.detail.left')}</Text>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      width: `${(testResult.L_score / 10) * 100}%`,
                      backgroundColor: leftEyeStatus.color 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.chartValue}>{testResult.L_score}/10</Text>
            </View>
            
            <View style={styles.chartBar}>
              <Text style={styles.chartLabel}>{t('landolt.detail.right')}</Text>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      width: `${(testResult.R_score / 10) * 100}%`,
                      backgroundColor: rightEyeStatus.color 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.chartValue}>{testResult.R_score}/10</Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.sectionTitle}>{t('landolt.detail.recommendations')}</Text>
          <View style={styles.recommendationsList}>
            {testResult.L_logMar > 0.3 || testResult.R_logMar > 0.3 ? (
              <>
                <Text style={styles.recommendationItem}>{t('landolt.detail.recommendation_exam')}</Text>
                <Text style={styles.recommendationItem}>{t('landolt.detail.recommendation_monitor')}</Text>
                <Text style={styles.recommendationItem}>{t('landolt.detail.recommendation_breaks')}</Text>
              </>
            ) : (
              <>
                <Text style={styles.recommendationItem}>{t('landolt.detail.recommendation_continue')}</Text>
                <Text style={styles.recommendationItem}>{t('landolt.detail.recommendation_practices')}</Text>
                <Text style={styles.recommendationItem}>{t('landolt.detail.recommendation_checkups')}</Text>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('CameraScreen')}
          >
            <Text style={styles.actionButtonText}>{t('landolt.detail.take_new_test')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>{t('landolt.detail.back_to_history')}</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.darkGreen,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.darkGreen,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginHorizontal:5,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 8,
  },
  testDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userId: {
    fontSize: 14,
    color: '#888',
  },
  summaryCard: {
    marginHorizontal:5,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGreen,
  },
  eyeCard: {
    backgroundColor: Colors.white,
    marginHorizontal:5,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eyeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 16,
  },
  eyeContent: {
    gap: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGreen,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  comparisonCard: {
    backgroundColor: Colors.white,
    marginHorizontal:5,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonChart: {
    gap: 16,
  },
  chartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chartLabel: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
  barContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
  chartValue: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGreen,
    textAlign: 'right',
  },
  recommendationsCard: {
    marginHorizontal:5,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationsList: {
    gap: 8,
  },
  recommendationItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    marginHorizontal:5,
    backgroundColor: Colors.darkGreen,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.darkGreen,
  },
  secondaryButtonText: {
    color: Colors.darkGreen,
  },
});

export default LandoltCDetail; 