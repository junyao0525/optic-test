import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useForm} from 'react-hook-form';
import {Alert, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Divider from '../../components/Divider';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import {Colors, TextStyle} from '../../themes';

type formData = {
  name: string;
  email: string;
  password: string;
};

const initialData: formData = {
  name: '',
  email: '',
  password: '',
};

const Register = () => {
  const navigation = useNavigation();

  const {control, handleSubmit} = useForm({
    defaultValues: initialData,
  });

  const onSubmit = (data: formData) => {
    console.log('Form Data:', data);
    Alert.alert('Register Success', `Email: ${data.email}`);
  };

  return (
    <>
      <Header title={'Register'} backButton headerColor={Colors.white} />
      <Divider marginVertical={0} thickness={0.2} />
      <View style={styles.container}>
        <View>
          <Text style={[TextStyle.H1, styles.mainText]}>Sign up</Text>
          <Text style={styles.secondText}>Create an account to continue.</Text>
          <InputField
            containerStyle={{paddingBottom: 10}}
            label="Name"
            control={control}
            name="name"
          />
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
                Register
              </Text>
            </TouchableHighlight>
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
    marginTop: 15,
  },
});

export default Register;
