import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { User } from '../../../types/app/user';
import { AuthController } from '../../api/auth/controller';
import { FileUploadController } from '../../api/fileUpload/controller';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import { useAuth } from '../../providers/AuthProvider';
import { useStoragePermission } from '../../providers/StoragePermissionProvider';
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
  const { hasStoragePermission, requestStoragePermission } = useStoragePermission();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('dob', user.dob ? new Date(user.dob) : new Date());
      setValue('gender', user.gender || 'male');
      setProfileImage(user.profile_image_url || null);
    }
  }, [user, setValue]);

  const handleImagePicker = async () => {
    try {
      if (!hasStoragePermission) {
        const granted = await requestStoragePermission();
        console.log(granted)
        if (!granted) {
          Alert.alert(
            t('common.error'),
            t('profile.storage_permission_required'),
            [
              {
                text: t('common.settings'),
                onPress: () => {
                  if (Platform.OS === 'android') {
                    Linking.openSettings();
                  }
                },
              },
              {
                text: t('common.cancel'),
                style: 'cancel',
              },
            ]
          );
          return;
        }
      }

      // Simple image picker implementation
      const pickImage = async () => {
        try {
          const { launchImageLibrary } = require('react-native-image-picker');
          const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
          });

          if (result.didCancel) {
            return;
          }

          if (result.errorCode) {
            throw new Error(result.errorMessage);
          }

          if (result.assets && result.assets[0] && user?.id) {
            setIsLoading(true);
            setUploadError(null);

            const response = await FileUploadController.uploadProfileImage(
              user.id,
              result.assets[0]
            );

            if (response.success && response.data?.url) {
              setProfileImage(response.data.url);
              if (user) {
                updateUser({ ...user, profile_image_url: response.data.url });
              }
            } else {
              throw new Error(response.message || 'Failed to upload image');
            }
          }
        } catch (error: any) {
          console.error('Image picker error:', error);
          throw error;
        }
      };

      await pickImage();
    } catch (error: any) {
      console.error('Image upload error:', error);
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;

    const response = await AuthController.updateProfile(user.id, {
      name: data.name,
      gender: data.gender,
      dob: data.dob.toISOString(),
    });

    if (response.success && response.data) {
      updateUser(response.data as User);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('settings.profile')} backButton />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Profile Image Section */}
          <View style={styles.imageSection}>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.imageContainer}
              disabled={isLoading}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('../../../assets/images/person.png')
                }
                style={styles.profileImage}
              />
              <View style={styles.imageOverlay}>
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.changePhotoText}>
                    {t('profile.changePhoto')}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            {uploadError && (
              <Text style={styles.errorText}>{uploadError}</Text>
            )}
          </View>

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

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSubmit(onSubmit)}>
              <Text style={styles.saveButtonText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    ...TextStyle.P1B,
    color: Colors.white,
  },
});

export default Profile;
