import dayjs from 'dayjs';
import React, {useState} from 'react';
import {Controller} from 'react-hook-form';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import DatePicker, {
  DatePickerProps as BaseDatePickerProps,
} from 'react-native-date-picker';
import {Colors, TextStyle} from '../themes';

interface FormDatePickerProps {
  control: any;
  name: string;
  label: string;
  rules?: object;
  error?: string;
  placeholder?: string;
  editable?: boolean;
  topErrorText?: boolean;
  imageSource?: any;
  required?: boolean;
  value?: Date | string;
}

const FormDatePicker: React.FC<
  FormDatePickerProps & Omit<BaseDatePickerProps, 'date'>
> = ({
  control,
  name,
  label,
  rules,
  error,
  topErrorText = false,
  imageSource,
  required = false,
  editable = true,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      disabled={!editable}
      rules={rules}
      render={({field: {onChange, value}}) => (
        <View style={styles.container}>
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
          <Pressable disabled={!editable} onPress={() => setOpen(true)}>
            <View
              style={[
                styles.outsideInput,
                !editable && {backgroundColor: Colors.borderGrey},
                error ? {borderColor: Colors.red} : undefined,
              ]}>
              <Text style={[styles.input]}>
                {value ? dayjs(value).format('DD/MM/YYYY') : 'Select Date'}
              </Text>
              {imageSource && (
                <Image source={imageSource} style={styles.imageIcon} />
              )}
              <DatePicker
                modal
                open={open}
                date={value}
                mode="date"
                onConfirm={selectedDate => {
                  setOpen(false);
                  onChange(selectedDate);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
                {...rest}
              />
            </View>
          </Pressable>

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
    fontSize: 14,
    fontWeight: '700',
  },
  topError: {
    color: Colors.red,
    fontSize: 13,
    fontWeight: '400',
  },
  outsideInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 5,
    padding: 10,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  input: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 0,
    borderColor: Colors.borderGrey,
    borderRadius: 5,
    color: Colors.black,
    maxHeight: 40,
    textAlignVertical: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: 5,
  },
  imageIcon: {
    width: 22,
    height: 22,
    marginLeft: 'auto',
  },
  requiredSpan: {
    color: Colors.red,
  },
});

export default FormDatePicker;
