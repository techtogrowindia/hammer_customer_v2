import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  withMargin?: boolean;
}

export function SectionHeader({ title, actionLabel, onActionPress, withMargin = true }: SectionHeaderProps) {
  if (!actionLabel) {
    return <Text style={[styles.title, withMargin && { marginBottom: 14 }]}>{title}</Text>;
  }

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { marginBottom: 0 }]}>{title}</Text>
      <Pressable onPress={onActionPress} hitSlop={8}>
        <Text style={styles.action}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  title: { fontFamily: 'Poppins_600SemiBold', fontSize: 17, color: AppColors.textPrimary },
  action: { fontFamily: fontTokens.fontFamily.medium, fontSize: 13, color: AppColors.primary },
});

export default SectionHeader;
