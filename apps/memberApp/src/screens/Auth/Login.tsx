// screens/Login.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
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
import InputField from '../../components/InputField';
import LoadingOverlay from '../../components/Loading';
import { useAuth } from '../../providers/AuthProvider';
import { Colors, TextStyle } from '../../themes';

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const navigation = useNavigation();
  const {login} = useAuth();
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();
  const {control, handleSubmit} = useForm<FormData>({
    defaultValues: {email: '', password: ''},
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await login(data);
    } catch (err) {
      Alert.alert(t('auth.login_failed'));
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = useCallback(() => {
    navigation.navigate('Register' as never);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/BR_appIcon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('auth.welcome_back')}</Text>
        <Text style={styles.subtitle}>{t('auth.login_subtitle')}</Text>
      </View>

      <View style={styles.form}>
        <InputField
          containerStyle={styles.inputContainer}
          label={t('auth.email')}
          control={control}
          name="email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          containerStyle={styles.inputContainer}
          label={t('auth.password')}
          control={control}
          name="password"
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>
            {t('auth.forgot_password')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.loginButtonText}>{t('auth.login')}</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>{t('auth.no_account')}</Text>
          <TouchableOpacity onPress={onSignUp}>
            <Text style={styles.signUpLink}>{t('auth.register')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <LoadingOverlay visible={loading} />
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
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    ...TextStyle.P2,
    color: Colors.darkGreen,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    ...TextStyle.P1B,
    color: Colors.white,
    textAlign: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    ...TextStyle.P2,
    color: Colors.black,
  },
  signUpLink: {
    ...TextStyle.P2B,
    color: Colors.primary,
    marginLeft: 5,
  },
});

export default Login;
