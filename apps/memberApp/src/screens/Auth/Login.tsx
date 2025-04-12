import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import {Colors, TextStyle} from '../../themes';

const Login = () => {
  return (
    <>
      <Header title={''} backButton />
      <View style={styles.container}>
        <View>
          <Text style={(TextStyle.H1, styles.mainText)}>
            Sign in to your OptiTest Account
          </Text>
          <Text style={styles.secondText}>
            Enter your Email and Password to login.
          </Text>
          <InputField label="Email" />
          <InputField label="Password" />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  mainText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.black,
  },
  secondText: {
    paddingTop: 20,
  },
});
export default Login;
