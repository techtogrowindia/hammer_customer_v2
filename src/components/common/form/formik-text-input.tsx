import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useField } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

type FormikTextInputProps = Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> & {
  name: string;
  label?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  wrapperStyle?: ViewStyle;
  inputStyle?: TextInputProps['style'];
  formatter?: (value: string) => string;
  showError?: boolean;
};

export function FormikTextInput({
  name,
  label,
  left,
  right,
  wrapperStyle,
  inputStyle,
  formatter,
  showError = true,
  onFocus,
  placeholderTextColor = AppColors.textTertiary,
  ...props
}: FormikTextInputProps) {
  const [field, meta, helpers] = useField<string>(name);
  const [focused, setFocused] = useState(false);
  const error = Boolean(showError && meta.touched && meta.error);

  return (
    <View style={[styles.group, wrapperStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, focused && styles.focused, error && styles.errored]}>
        {left}
        <TextInput
          value={field.value}
          onChangeText={(text) => helpers.setValue(formatter ? formatter(text) : text)}
          onBlur={() => {
            setFocused(false);
            helpers.setTouched(true);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholderTextColor={placeholderTextColor}
          style={[styles.input, inputStyle]}
          {...props}
        />
        {right}
      </View>
      {error ? <Text style={styles.errorText}>{meta.error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    maxWidth: 330,
  },
  label: {
    marginBottom: 8,
    fontFamily: fontTokens.fontFamily.medium,
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  inputWrap: {
    width: '100%',
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  focused: {
    borderColor: AppColors.primary,
  },
  errored: {
    borderColor: AppColors.error,
  },
  input: {
    flex: 1,
    fontFamily: fontTokens.fontFamily.medium,
    fontSize: 15,
    color: AppColors.textPrimary,
  },
  errorText: {
    marginTop: 6,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.error,
  },
});
