import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useForm} from 'react-hook-form';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Divider from '../../components/Divider';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import {Colors, TextStyle} from '../../themes';
import {AuthController} from '../../api/auth/controller';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const {error} = await AuthController.register(data);

      if (error) {
        Alert.alert('Registration Failed', error.message);
      } else {
        Alert.alert('Success', 'Account created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Header title={'Register'} backButton headerColor={Colors.white} />
      <Divider marginVertical={0} thickness={0.2} />
      <View style={styles.container}>
        <Text style={[TextStyle.H1, styles.mainText]}>Sign up</Text>
        <Text style={styles.secondText}>Create an account to continue.</Text>

        <InputField
          containerStyle={{paddingBottom: 10}}
          label="Name"
          control={control}
          name="name"
          rules={{required: 'Name is required'}}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        <InputField
          containerStyle={{paddingBottom: 10}}
          label="Email"
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Email is not valid',
            },
          }}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        <InputField
          containerStyle={{paddingBottom: 10}}
          label="Password"
          control={control}
          name="password"
          secureTextEntry
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
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
    justifyContent: 'flex-start',
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
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 5,
  },
});

export default Register;
