import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Button, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../themes';

type Props = {
  successMessage: string;
  targetScreen: string;
  extraData?: any; // Optional detailed results
};

const SuccessPage = ({successMessage, targetScreen, extraData}: Props) => {
  const navigation = useNavigation();

  const handleRedirect = () => {
    navigation.navigate(targetScreen as never);
  };

  // Optional auto-redirect after 5 seconds
  // useEffect(() => {
  //   const timer = setTimeout(() => handleRedirect(), 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.successText}>✅ Success</Text>
      <Text style={styles.messageText}>{successMessage}</Text>

      {extraData && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Fatigue Analysis Result:</Text>
          <Text style={styles.resultText}>{extraData}</Text>
        </View>
      )}

      <Button title="Go to Next Screen" onPress={handleRedirect} />
    </ScrollView>
  );
};

export default SuccessPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.backgroundColor,
  },
  successText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultBox: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary || Colors.black,
    marginBottom: 5,
  },
  resultText: {
    fontSize: 14,
    color: Colors.black,
    lineHeight: 20,
  },
});
