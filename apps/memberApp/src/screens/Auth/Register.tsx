import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthController } from '../../api/auth/controller';
import InputField from '../../components/InputField';
import { Colors, TextStyle } from '../../themes';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

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
        Alert.alert(t('auth.registration_failed'), error.message);
      } else {
        Alert.alert(t('auth.success'), t('auth.account_created'), [
          {
            text: t('common.ok'),
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      }
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || t('common.something_went_wrong'));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/BR_appIcon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('auth.create_account')}</Text>
        <Text style={styles.subtitle}>{t('auth.register_subtitle')}</Text>
      </View>

      <View style={styles.form}>
        <InputField
          containerStyle={styles.inputContainer}
          label={t('auth.name')}
          control={control}
          name="name"
          rules={{required: t('auth.name_required')}}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        <InputField
          containerStyle={styles.inputContainer}
          label={t('auth.email')}
          control={control}
          name="email"
          keyboardType="email-address"
          autoCapitalize="none"
          rules={{
            required: t('auth.email_required'),
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: t('auth.email_invalid'),
            },
          }}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <InputField
          containerStyle={styles.inputContainer}
          label={t('auth.password')}
          control={control}
          name="password"
          secureTextEntry
          rules={{
            required: t('auth.password_required'),
            minLength: {
              value: 6,
              message: t('auth.password_min_length'),
            },
          }}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.registerButtonText}>{t('auth.register')}</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>{t('auth.have_account')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>{t('auth.login')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    ...TextStyle.H1,
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...TextStyle.P2,
    color: Colors.darkGreen,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 10,
  },
  error: {
    ...TextStyle.P3,
    color: Colors.red,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  registerButtonText: {
    ...TextStyle.P1B,
    color: Colors.white,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...TextStyle.P2,
    color: Colors.black,
  },
  loginLink: {
    ...TextStyle.P2B,
    color: Colors.primary,
    marginLeft: 5,
  },
});

export default Register;
