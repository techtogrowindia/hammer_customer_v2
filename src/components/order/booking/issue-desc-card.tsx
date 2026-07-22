import { AppColors } from '@/core/theme/app-colors';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { styles } from '../../../app/(tabs)/(home,orders,services,profile)/booking/[booking-id]';

interface Props {
  value: string;
  onChange: (text: string) => void;
  error?: string | null;
  showValidation: boolean;
}

export function IssueDescriptionCard({ value, onChange, error, showValidation }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionLabelRow}>
        <Text style={styles.sectionLabel}>Explain the issue</Text>
        <Text style={styles.requiredMark}>*</Text>
      </View>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder='e.g. Need to install new AC'
        placeholderTextColor={AppColors.textTertiary}
        multiline
        numberOfLines={3}
        style={styles.textArea}
      />
      {showValidation && error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
