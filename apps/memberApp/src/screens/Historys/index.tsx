import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {
  LandoltController,
  LandoltTestResultResponse,
} from '../../api/LandoltC/controller';
import Header from '../../components/Header';
import {useWindowDimension} from '../../hooks/useWindowDimension';
import {Colors} from '../../themes';
import {useUserId} from '../../utils/userUtils';

// Mock data for demonstration
const mockEyeTirednessResults = [
  {
    id: 1,
    date: '2024-01-15',
    fatigueLevel: 'Low',
    duration: '5 min',
    blinkRate: '15/min',
  },
  {
    id: 2,
    date: '2024-01-10',
    fatigueLevel: 'Medium',
    duration: '8 min',
    blinkRate: '12/min',
  },
  {
    id: 3,
    date: '2024-01-05',
    fatigueLevel: 'High',
    duration: '12 min',
    blinkRate: '8/min',
  },
];

const LandoltResultsScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const userId = useUserId();
  const [landoltResults, setLandoltResults] = useState<
    LandoltTestResultResponse[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLandoltResults();
  }, [userId]);

  const fetchLandoltResults = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const result = await LandoltController.getUserTestResults(userId);
      if (result.success) {
        setLandoltResults(result.data);
      } else {
        console.error('Failed to fetch Landolt results:', result.message);
        Alert.alert('Error', 'Failed to load test results');
      }
    } catch (error) {
      console.error('Error fetching Landolt results:', error);
      Alert.alert('Error', 'Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (resultId: number) => {
    navigation.navigate('LandoltCDetail', {resultId});
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.sectionTitle}>{t('history.loading')}</Text>
        </View>
      </ScrollView>
    );
  }

  if (landoltResults.length === 0) {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.sectionTitle}>
            {t('history.landolt_test_results')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t('history.no_test_results')}
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>
          {t('history.landolt_test_results')}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {t('history.recent_test_results')}
        </Text>
      </View>

      {landoltResults.map(result => (
        <TouchableOpacity
          key={result.id}
          style={styles.resultCard}
          onPress={() => handleViewDetails(result.id)}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>{formatDate(result.created_at)}</Text>
            <Text style={styles.cardId}>#{result.id}</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.scoreRow}>
              <View style={styles.eyeScore}>
                <Text style={styles.eyeLabel}>{t('history.left_eye')}</Text>
                <Text style={styles.scoreText}>{result.L_score}/12</Text>
                <Text style={styles.logMARText}>
                  {t('history.logmar')} {result.L_logMar}
                </Text>
                <Text style={styles.snellenText}>
                  {t('history.snellen')} {result.L_snellen}
                </Text>
              </View>
              <View style={styles.eyeScore}>
                <Text style={styles.eyeLabel}>{t('history.right_eye')}</Text>
                <Text style={styles.scoreText}>{result.R_score}/12</Text>
                <Text style={styles.logMARText}>
                  {t('history.logmar')} {result.R_logMar}
                </Text>
                <Text style={styles.snellenText}>
                  {t('history.snellen')} {result.R_snellen}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.viewDetailsText}>
              {t('history.view_details')}
            </Text>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>{t('history.view_all_results')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const EyeTirednessResultsScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const handleViewDetails = (resultId: number) => {
    // Navigate to detailed result view - using existing routes for now
    navigation.navigate('Tab', {screen: 'Home'});
  };

  const getFatigueColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'high':
        return '#F44336';
      default:
        return '#666';
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>
          {t('history.eye_tiredness_results')}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {t('history.recent_test_results')}
        </Text>
      </View>

      {mockEyeTirednessResults.map(result => (
        <TouchableOpacity
          key={result.id}
          style={styles.resultCard}
          onPress={() => handleViewDetails(result.id)}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>{result.date}</Text>
            <Text style={styles.cardId}>#{result.id}</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.fatigueRow}>
              <View style={styles.fatigueItem}>
                <Text style={styles.fatigueLabel}>
                  {t('history.fatigue_level')}
                </Text>
                <Text
                  style={[
                    styles.fatigueLevel,
                    {color: getFatigueColor(result.fatigueLevel)},
                  ]}>
                  {result.fatigueLevel}
                </Text>
              </View>
              <View style={styles.fatigueItem}>
                <Text style={styles.fatigueLabel}>{t('history.duration')}</Text>
                <Text style={styles.fatigueValue}>{result.duration}</Text>
              </View>
              <View style={styles.fatigueItem}>
                <Text style={styles.fatigueLabel}>
                  {t('history.blink_rate')}
                </Text>
                <Text style={styles.fatigueValue}>{result.blinkRate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.viewDetailsText}>
              {t('history.view_details')}
            </Text>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>{t('history.view_all_results')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const renderScene = SceneMap({
  landoltsTest: LandoltResultsScreen,
  eyeTiredness: EyeTirednessResultsScreen,
});

const HistoryScreen = () => {
  const layout = useWindowDimension();
  const {t} = useTranslation();
  const [index, setIndex] = useState(0);

  const routes = useMemo(
    () => [
      {key: 'landoltsTest', title: t('common.landoltTest')},
      {key: 'eyeTiredness', title: t('common.eyeTiredness')},
    ],
    [t],
  );

  return (
    <View style={styles.container}>
      <Header title={t('history.title')} menuButton />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorContainerStyle={styles.indicator}
            style={styles.tabBar}
            tabStyle={styles.tabItem}
            activeColor={Colors.black}
            inactiveColor={'grey'}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  headerSection: {
    padding: 20,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  resultCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
  cardId: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  cardContent: {
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyeScore: {
    flex: 1,
    alignItems: 'center',
  },
  eyeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 2,
  },
  logMARText: {
    fontSize: 12,
    color: '#666',
  },
  snellenText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  fatigueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fatigueItem: {
    flex: 1,
    alignItems: 'center',
  },
  fatigueLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  fatigueLevel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fatigueValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundColor,
  },
  viewDetailsText: {
    fontSize: 14,
    color: Colors.darkGreen,
    fontWeight: '600',
  },
  arrowText: {
    fontSize: 18,
    color: Colors.darkGreen,
    fontWeight: 'bold',
  },
  viewAllButton: {
    backgroundColor: Colors.darkGreen,
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewAllText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  tabBar: {backgroundColor: Colors.backgroundColor},
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  indicator: {backgroundColor: Colors.darkGreen},
});

export default HistoryScreen;
