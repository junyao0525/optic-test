import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FatigueResultResponse} from '../../api/EyeFatigue/controller';
import {useFatigue} from '../../hooks/useFatigue';
import {Colors} from '../../themes';
import dayjs from 'dayjs';
import {formatStatus} from '../../utils/formatStatus';
import {formatDateTime} from '../../utils/formatDateTime';
import Header from '../../components/Header';
import {t} from 'i18next';

const {width, height} = Dimensions.get('window');

type RouteParams = {
  resultId: number;
};

const FatigueDetailPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {resultId} = route.params as RouteParams;
  const {getTestResultById} = useFatigue();
  const [data, setData] = useState<FatigueResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    'overview' | 'metrics' | 'advice'
  >('overview');

  // Mock function - replace with actual API call
  const getFatigueLevel = (fatigueClass: string) => {
    const level = fatigueClass.toLowerCase();
    if (level.includes('high'))
      return {level: 'High', color: '#FF3B30', percentage: 85};
    if (level.includes('moderate'))
      return {level: 'Moderate', color: '#FF9500', percentage: 65};
    if (level.includes('mild'))
      return {level: 'Mild', color: '#FFCC00', percentage: 35};
    return {level: 'Normal', color: '#34C759', percentage: 15};
  };

  const fatigueInfo = getFatigueLevel(data?.class || 'Error');

  const getMetricStatus = (key: string, value: string) => {
    // Add logic to determine if metric values are normal/abnormal
    const numValue = parseFloat(value);
    switch (key.toLowerCase()) {
      case 'perclos':
        return numValue > 0.15 ? 'warning' : 'normal';
      case 'blink_rate':
        return numValue < 10 || numValue > 30 ? 'warning' : 'normal';
      case 'ear_mean':
        return numValue < 0.2 ? 'warning' : 'normal';
      case 'avg_blink':
        return numValue > 0.4 ? 'warning' : 'normal'; // Adjust threshold as needed
      case 'ear_std':
        return numValue > 0.05 ? 'warning' : 'normal'; // Adjust threshold as needed
      default:
        return 'normal';
    }
  };

  const getRecommendations = () => {
    const level = fatigueInfo.level.toLowerCase();
    if (level === 'severe') {
      return t('eye_tiredness.recommendations.severe', {
        returnObjects: true,
      }) as string[];
    } else if (level === 'moderate') {
      return t('eye_tiredness.recommendations.moderate', {
        returnObjects: true,
      }) as string[];
    } else if (level === 'mild') {
      return t('eye_tiredness.recommendations.mild', {
        returnObjects: true,
      }) as string[];
    }
    return t('eye_tiredness.recommendations.normal', {
      returnObjects: true,
    }) as string[];
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTestResultById(resultId);
        if (result.success) {
          setData(result.data);
        } else {
          Alert.alert('Error', 'Failed to load test result');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching test result:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [resultId]);
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: 'center', marginTop: 50}}>
          {t('eye_tiredness.loading_analysis')}
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: 'center', marginTop: 50}}>
          {t('eye_tiredness.failed_load_data')}
        </Text>
      </View>
    );
  }
  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Fatigue Level Card */}
      <View style={[styles.statusCard, {borderLeftColor: fatigueInfo.color}]}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>
            {t('eye_tiredness.current_fatigue_level')}
          </Text>
          <Text style={[styles.statusLevel, {color: fatigueInfo.color}]}>
            {fatigueInfo.level}
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStatsContainer}>
        <Text style={styles.sectionTitle}>
          {t('eye_tiredness.key_indicators')}
        </Text>
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatValue}>{data.perclos}</Text>
            <Text style={styles.quickStatLabel}>PERCLOS</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    getMetricStatus('PERCLOS', data.perclos) === 'warning'
                      ? '#FF9500'
                      : '#34C759',
                },
              ]}
            />
          </View>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatValue}>{data.blink_rate}</Text>
            <Text style={styles.quickStatLabel}>Blink Rate</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    getMetricStatus('Blink Rate', data.blink_rate) === 'warning'
                      ? '#FF9500'
                      : '#34C759',
                },
              ]}
            />
          </View>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatValue}>{data.ear_mean}</Text>
            <Text style={styles.quickStatLabel}>EAR Mean</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    getMetricStatus('EAR Mean', data.ear_mean) === 'warning'
                      ? '#FF9500'
                      : '#34C759',
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Analysis Time */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          {t('eye_tiredness.analysis_details')}
        </Text>
        <Text style={styles.infoText}>
          {t('eye_tiredness.timestamp')} {formatDateTime(data.created_at)}
        </Text>
        <Text style={styles.infoText}>
          {t('eye_tiredness.analysis_id')} #{resultId}
        </Text>
      </View>
    </View>
  );

  const renderMetricsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>
        {t('eye_tiredness.detailed_metrics')}
      </Text>
      {Object.entries(data).map(([key, value], index) => {
        const status = getMetricStatus(key, value);
        if (
          key === 'id' ||
          key === 'user_id' ||
          key === 'created_at' ||
          key === 'class'
        )
          return null;
        return (
          <View key={index} style={styles.metricDetailCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricName}>{formatStatus(key)}</Text>
              <View
                style={[
                  styles.metricStatus,
                  {
                    backgroundColor:
                      status === 'warning' ? '#FF9500' : '#34C759',
                  },
                ]}>
                <Text style={styles.metricStatusText}>
                  {status === 'warning'
                    ? t('eye_tiredness.caution')
                    : t('eye_tiredness.normal')}
                </Text>
              </View>
            </View>
            <Text style={styles.metricValue}>
              {key == 'created_at' ? formatDateTime(value) : value}
            </Text>
            <Text style={styles.metricDescription}>
              {getMetricDescription(key)}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const renderRecommendationsTab = () => (
    <View style={styles.tabContent}>
      <View
        style={[
          styles.recommendationHeader,
          {backgroundColor: fatigueInfo.color + '15'},
        ]}>
        <Text style={styles.recommendationTitle}>
          {t('eye_tiredness.recommendations_for', {level: fatigueInfo.level})}
        </Text>
      </View>

      {getRecommendations().map((recommendation, index) => (
        <View key={index} style={styles.recommendationCard}>
          <View style={styles.recommendationNumber}>
            <Text style={styles.recommendationNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.recommendationText}>{recommendation}</Text>
        </View>
      ))}

      <View style={styles.emergencyCard}>
        <Text style={styles.emergencyTitle}>
          {t('eye_tiredness.emergency_contacts')}
        </Text>
        <Text style={styles.emergencyText}>
          {t('eye_tiredness.emergency_message')}
        </Text>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyButtonText}>
            {t('eye_tiredness.emergency_services')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getMetricDescription = (key: string) => {
    return (
      t(`eye_tiredness.metric_descriptions.${key}`) ||
      'Metric description not available'
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.backgroundColor}
      />

      {/* Header */}
      <Header title={t('landolt.detail.title')} backButton />

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {['overview', 'metrics', 'advice'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab as any)}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'metrics' && renderMetricsTab()}
        {selectedTab === 'advice' && renderRecommendationsTab()}
      </ScrollView>
    </View>
  );
};

export default FatigueDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor || '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: Colors.white || '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary || '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black || '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor || '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGrey,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.backgroundColor || '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondary || '#666666',
  },
  activeTabText: {
    color: Colors.black || '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: Colors.white || '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black || '#666666',
  },
  statusLevel: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e1e5e9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.black || '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black || '#1a1a1a',
    marginBottom: 16,
  },
  quickStatsContainer: {
    marginBottom: 20,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatCard: {
    backgroundColor: Colors.white || '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black || '#1a1a1a',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: Colors.black || '#666666',
    textAlign: 'center',
  },
  statusDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoCard: {
    backgroundColor: Colors.white || '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black || '#1a1a1a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.black || '#666666',
    marginBottom: 4,
  },
  metricDetailCard: {
    backgroundColor: Colors.white || '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black || '#1a1a1a',
    flex: 1,
  },
  metricStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white || '#ffffff',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black || '#1a1a1a',
    marginBottom: 8,
  },
  metricDescription: {
    fontSize: 13,
    color: Colors.secondary || '#666666',
    lineHeight: 18,
  },
  recommendationHeader: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black || '#1a1a1a',
    textAlign: 'center',
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white || '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary || '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  recommendationNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white || '#ffffff',
  },
  recommendationText: {
    fontSize: 14,
    color: Colors.black || '#1a1a1a',
    lineHeight: 20,
    flex: 1,
  },
  emergencyCard: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white || '#ffffff',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: Colors.white || '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: Colors.white || '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
