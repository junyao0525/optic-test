import { useNavigation } from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  LandoltController,
  LandoltTestResultResponse,
} from '../api/LandoltC/controller';
import Header from '../components/Header';
import { useWindowDimension } from '../hooks/useWindowDimension';
import { Colors } from '../themes';
import { useUserId, useUserName } from '../utils/userUtils';

// const {t} = useTranslation();

type ButtonDetail = {
  title: string;
  image: ImageSourcePropType;
  route: string;
  param?: {screen: string};
  description: string;
  color: string;
};

const LandoltImage = require('../../assets/images/home/landolt.png');
const EyeTirednessImage = require('../../assets/images/home/eye-tiredness.png');

const HomeScreen = () => {
  const {navigate} = useNavigation();
  const {t} = useTranslation();
  const {width} = useWindowDimension();
  const userId = useUserId();
  const userName = useUserName();

  const [testResults, setTestResults] = useState<LandoltTestResultResponse[]>(
    [],
  );


  useFocusEffect(
    useCallback(() => {
      fetchTestResults();
    }, [userId])
  );

  const fetchTestResults = async () => {
    if (!userId) {
      return;
    }

    try {
      const result = await LandoltController.getUserTestResults(userId);
      if (result.success) {
        setTestResults(result.data);
      } else {
        console.error('Failed to fetch test results:', result.message);
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  };

  const getChartData = () => {
    if (testResults.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{data: [0]}],
      };
    }

    const sortedResults = [...testResults]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5)
      .reverse();

    const labels = sortedResults.map(result => formatDate(result.created_at));
    const leftEyeData = sortedResults.map(result => result.L_logMar);
    const rightEyeData = sortedResults.map(result => result.R_logMar);

    return {
      labels,
      datasets: [
        {
          data: leftEyeData,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: rightEyeData,
          color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartData = getChartData();

  const buttonDetails: ButtonDetail[] = [
    {
      title: t('common.landoltTest'),
      image: LandoltImage,
      route: 'CameraScreen',
      param: {screen: 'LandoltC'},
      description: t('home.landolt_description'),
      color: '#4CAF50',
    },
    {
      title: t('common.eyeTiredness'),
      image: EyeTirednessImage,
      route: 'EyeTiredness',
      description: t('home.eye_tiredness_description'),
      color: '#FF9800',
    },
  ];

  const handleButtonPress = (route: string, param?: {screen: string}) => {
    if (param) {
      navigate(route as any, {screen: param.screen});
    } else {
      navigate(route as any);
    }
    console.log(`${route} button pressed`);
  };

  return (
    <View style={styles.container}>
      <Header title={t('home.title')} menuButton />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            {t('home.greeting', {name: userName})}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {t('home.welcome_subtitle')}
          </Text>
        </View>

        {/* Progress Chart */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>        
              <Text style={styles.sectionTitle}>{t('common.overview')}</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigate('History' as any)}>
              <Text style={styles.viewAllText}>{t('home.view_all')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
                width={width - 60}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: '#F9FAFB',
                  backgroundGradientFrom: '#F9FAFB',
                  backgroundGradientTo: '#F9FAFB',
                  decimalPlaces: 2,
                  color: (opacity = 1) => Colors.lightGreen,
                  labelColor: (opacity = 1) => Colors.black,
                  style: {
                    borderRadius: 20,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: Colors.white,
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: 'rgba(200, 200, 200, 0.3)',
                  },
                }}
                bezier
                style={{
                  borderRadius: 20,
                  marginVertical: 8,
                }}
              />
            </View>

            {/* Chart Legend */}
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, {backgroundColor: '#4CAF50'}]}
                />
                <Text style={styles.legendText}>{t('history.left_eye')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, {backgroundColor: '#FF9800'}]}
                />
                <Text style={styles.legendText}>{t('history.right_eye')}</Text>
              </View>
            </View>
             <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 14}}>
                <Ionicons name="help-circle-outline" size={16} color="#666" style={{marginRight: 4}} />
                <Text style={{fontSize: 12, color: '#666', lineHeight: 22}}>
                  {t('common.lower_score')}
                </Text>
              </View>
          </View>
        </View>

        {/* Test Types Section */}
        <View style={styles.testTypesSection}>
          <Text style={styles.sectionTitle}>{t('home.testTypes')}</Text>
          <Text style={styles.sectionSubtitle}>{t('home.choose_test')}</Text>

          <View style={styles.testButtonsContainer}>
            {buttonDetails.map((item, index) => (
              <TouchableOpacity
                key={item.title}
                style={[styles.testButton, {backgroundColor: item.color}]}
                onPress={() => handleButtonPress(item.route, item.param)}
                activeOpacity={0.8}>
                <View style={styles.testButtonContent}>
                  <Text style={styles.testButtonTitle}>{item.title}</Text>
                  <Text style={styles.testButtonDescription}>
                    {item.description}
                  </Text>
                </View>
                <View style={styles.testButtonIcon}>
                  <Text style={styles.testButtonArrow}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{marginBottom: 20}}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 30,
    marginHorizontal: 5,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
    marginHorizontal: 5,
  },
  statCard: {
    marginHorizontal: 5,
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  chartSection: {
    marginHorizontal: 5,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGreen,
  },
  viewAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.darkGreen,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  chart: {
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  latestResultSection: {
    marginBottom: 30,
    marginHorizontal: 5,
  },
  resultDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeResult: {
    flex: 1,
    alignItems: 'center',
  },
  eyeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGreen,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 4,
  },
  logMARValue: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  testTypesSection: {
    marginBottom: 30,
    marginHorizontal: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  testButtonsContainer: {
    gap: 16,
  },
  testButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  testButtonContent: {
    flex: 1,
  },
  testButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 6,
  },
  testButtonDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  testButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonArrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  quickActionsSection: {
    marginBottom: 20,
    marginHorizontal: 5,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
});

export default HomeScreen;
