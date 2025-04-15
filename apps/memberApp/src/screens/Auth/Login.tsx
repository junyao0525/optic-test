import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Divider from '../../components/Divider';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import {Colors, TextStyle} from '../../themes';

const Login = () => {
  const navigation = useNavigation();
  const {control, handleSubmit} = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
    Alert.alert('Login Success', `Email: ${data.email}`);
  };

  const onSignUp = useCallback(() => {
    navigation.navigate('Register');
  }, []);

  return (
    <>
      <Header title={''} backButton headerColor={Colors.white} />
      <Divider marginVertical={0} thickness={0.2} />
      <View style={styles.container}>
        <View>
          <Text style={[TextStyle.H1, styles.mainText]}>
            Sign in to your Account
          </Text>
          <Text style={styles.secondText}>
            Enter your email and password to login.
          </Text>
          <InputField
            containerStyle={{paddingBottom: 10}}
            label="Email"
            control={control}
            name="email"
          />
          <InputField
            containerStyle={{paddingBottom: 10}}
            label="Password"
            control={control}
            name="password"
          />
          <TouchableOpacity
            style={{alignSelf: 'flex-end', paddingVertical: 10}}>
            <Text style={[TextStyle.P2, {color: Colors.forgetPassword}]}>
              Forget Password?
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              onPress={handleSubmit(onSubmit)}
              underlayColor="white">
              <Text
                style={[
                  TextStyle.P1B,
                  {
                    backgroundColor: Colors.primary,
                    color: Colors.white,
                    paddingVertical: 10,
                    textAlign: 'center',
                    borderRadius: 5,
                  },
                ]}>
                Log in
              </Text>
            </TouchableHighlight>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                paddingVertical: 10,
              }}>
              <Text style={(TextStyle.P1, {fontSize: 18})}>
                Don’t have an account?
              </Text>
              <TouchableOpacity onPress={onSignUp}>
                <Text
                  style={(TextStyle.P1, {color: Colors.primary, fontSize: 18})}>
                  {' '}
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 20,
  },
  mainText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,
  },
  secondText: {
    paddingVertical: 20,
    fontSize: 14,
    color: Colors.darkGreen,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default Login;
