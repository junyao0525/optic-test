import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { User } from '../../../types/app/user';
import { AuthController } from '../../api/auth/controller';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import { useAuth } from '../../providers/AuthProvider';
import { Colors, TextStyle } from '../../themes';

type ProfileFormData = {
  name: string;
  email: string;
  dob: Date;
  gender: 'male' | 'female';
};

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      dob: user?.dob ? new Date(user.dob) : new Date(),
      gender: user?.gender || 'male',
    },
  });

  const getUserInfo = async () => {
    if (!user?.id) return;
    
    try {
      const response = await AuthController.getUserInfo(user.id);
      if (response.success && response.user) {
        updateUser(response.user as User);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('dob', user.dob ? new Date(user.dob) : new Date());
      setValue('gender', user.gender || 'male');
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!user?.id) {
        Alert.alert(t('common.error'), t('profile.user_not_found'));
        return;
      }

      setIsLoading(true);

      const response = await AuthController.updateProfile(user.id, {
        name: data.name,
        gender: data.gender,
        dob: data.dob.toISOString(),
      });

      if (response.success && response.data) {
        updateUser(response.data as User);
        Alert.alert(t('common.success'), t('profile.update_success'));
      } else {
        Alert.alert(t('common.error'), response.message || t('profile.update_failed'));
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert(t('common.error'), error.message || t('profile.update_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('settings.profile')} backButton />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Form Fields */}
          <View style={styles.formSection}>
            <Controller
              control={control}
              name="name"
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <InputField
                  control={control}
                  name="name"
                  label={t('profile.name')}
                  placeholder={t('profile.namePlaceholder')}
                  value={value}
                  onChangeText={onChange}
                  error={errors.name ? t('auth.name_required') : undefined}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <InputField
                  control={control}
                  name="email"
                  label={t('profile.email')}
                  placeholder={t('profile.emailPlaceholder')}
                  value={value}
                  onChangeText={onChange}
                  editable={false}
                  error={errors.email ? t('auth.email_required') : undefined}
                />
              )}
            />

            <Controller
              control={control}
              name="dob"
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}>
                  <InputField
                    control={control}
                    name="dob"
                    label={t('profile.dob')}
                    placeholder={t('profile.dob')}
                    value={value.toLocaleDateString()}
                    editable={false}
                    error={errors.dob ? t('auth.dob_required') : undefined}
                    style={{ backgroundColor: Colors.white }}
                  />
                </TouchableOpacity>
              )}
            />

            <DatePicker
              modal
              open={showDatePicker}
              date={control._formValues.dob}
              mode="date"
              onConfirm={(date) => {
                setShowDatePicker(false);
                setValue('dob', date);
              }}
              onCancel={() => {
                setShowDatePicker(false);
              }}
              maximumDate={new Date()}
            />

            <Controller
              control={control}
              name="gender"
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <View>
                  <Text style={styles.inputLabel}>{t('profile.gender')}</Text>
                  <View style={styles.genderButtons}>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        value === 'male' && styles.genderButtonActive,
                        errors.gender && styles.inputError,
                      ]}
                      onPress={() => onChange('male')}>
                      <Text
                        style={[
                          styles.genderButtonText,
                          value === 'male' && styles.genderButtonTextActive,
                        ]}>
                        {t('profile.male')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        value === 'female' && styles.genderButtonActive,
                        errors.gender && styles.inputError,
                      ]}
                      onPress={() => onChange('female')}>
                      <Text
                        style={[
                          styles.genderButtonText,
                          value === 'female' && styles.genderButtonTextActive,
                        ]}>
                        {t('profile.female')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.gender && (
                    <Text style={styles.errorText}>
                      {t('auth.gender_required')}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
      <BottomButton
        title={t('common.save')}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 60,
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.lightGreen,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    alignItems: 'center',
  },
  changePhotoText: {
    ...TextStyle.P2,
    color: Colors.white,
  },
  formSection: {
    gap: 16,
  },
  inputLabel: {
    ...TextStyle.P2,
    color: Colors.black,
    marginBottom: 8,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderButtonText: {
    ...TextStyle.P1,
    color: Colors.black,
  },
  genderButtonTextActive: {
    color: Colors.white,
  },
  inputError: {
    borderColor: Colors.red,
  },
  errorText: {
    ...TextStyle.P2,
    color: Colors.red,
    marginTop: 4,
  },
});

export default Profile;

