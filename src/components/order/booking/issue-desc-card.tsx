import { AppColors } from '@/core/theme/app-colors';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { styles } from '../../../app/(tabs)/(home,orders,services,profile)/booking/[booking-id]';

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export function IssueDescriptionCard({ value, onChange }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Explain the issue</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder='e.g. Need to install new AC'
        placeholderTextColor={AppColors.textTertiary}
        multiline
        numberOfLines={3}
        style={styles.textArea}
      />
    </View>
  );
}
