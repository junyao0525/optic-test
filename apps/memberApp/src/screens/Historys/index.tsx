import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Header from '../../components/Header';
import { Colors } from '../../themes';

const PlaceholderScreen: React.FC<{title: string}> = ({title}) => (
  <View style={styles.scene}>
    <Text style={styles.text}>{title} Content Goes Here</Text>
  </View>
);

const LandoltsTestRoute = () => <PlaceholderScreen title="Landolt's Test" />;
const EyeTirednessRoute = () => <PlaceholderScreen title="Eye Tiredness" />;

const renderScene = SceneMap({
  landoltsTest: LandoltsTestRoute,
  eyeTiredness: EyeTirednessRoute,
});

const HistoryScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'landoltsTest', title: "Landolt's Test"},
    {key: 'eyeTiredness', title: 'Eye Tiredness'},
  ]);

  return (
    <View style={styles.container}>
      <Header title={'History'} menuButton />
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
  scene: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 18, fontWeight: 'bold'},
  tabBar: {backgroundColor: Colors.black},
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightCyan,
    color: 'black',
  },
  indicator: {backgroundColor: 'white', color: 'black'},
  label: {color: 'black', fontWeight: 'bold'},
});

export default HistoryScreen;
