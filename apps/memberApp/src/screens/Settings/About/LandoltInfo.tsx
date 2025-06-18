import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../../../components/Header';
import LandoltInfoCard from '../../../components/LandoltInfoCard';

const LandoltInfo: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Landolt C Info" 
        backButton 
      />
      <LandoltInfoCard onClose={handleClose} showCloseButton={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default LandoltInfo; 