// InputText.tsx

import React, {ComponentProps} from 'react';
import {Controller} from 'react-hook-form';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {Colors, FontFamilies, TextStyle} from '../themes'; // Adjust this import based on your project structure

interface InputTextProps extends TextInputProps {
  control: any;
  name: string;
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  rules?: ComponentProps<typeof Controller>['rules'];
  multiline?: boolean;
  error?: string;
  placeholder?: string;
  editable?: boolean;
  numberOfLines?: number;
  topErrorText?: boolean;
  imageSource?: any;
  required?: boolean;
}

const InputField: React.FC<InputTextProps> = ({
  control,
  name,
  label,
  rules,
  multiline = false,
  error,
  placeholder = '',
  editable = true,
  topErrorText = false,
  required = false,
  containerStyle,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, value}}) => (
        <View style={[styles.container, containerStyle]}>
          <View style={styles.labelContainer}>
            <Text style={[TextStyle.P1B, styles.label]}>
              {label}{' '}
              <Text style={[TextStyle.P1B, styles.requiredSpan]}>
                {required ? '*' : ''}
              </Text>
            </Text>
            {topErrorText && error && (
              <Text style={[styles.topError]}>{error}</Text>
            )}
          </View>
          <View>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              editable={editable}
              multiline={multiline}
              numberOfLines={rest.numberOfLines}
              {...rest}
              style={[
                TextStyle.P2,
                styles.input,
                multiline && styles.textArea,
                !editable && {backgroundColor: Colors.green},
                error ? {borderColor: Colors.borderGrey} : undefined,
                rest?.style,
              ]}
            />
          </View>
          {!topErrorText && error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    marginBottom: 4,
    color: Colors.black,
    fontSize: 16,
    fontWeight: 700,
  },
  topError: {
    color: Colors.red,
    fontSize: 13,
    fontWeight: 400,
  },
  input: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 5,
    color: Colors.black,
    backgroundColor: Colors.white,
    fontFamily: FontFamilies.regular,
    fontWeight: '400',
    textAlignVertical: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
    fontSize: 14,
    lineHeight: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: 5,
  },
  requiredSpan: {
    color: Colors.red,
  },
});

export default InputField;
