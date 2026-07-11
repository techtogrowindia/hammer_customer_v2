import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconType } from '../home.types';

interface InfoStripProps {
  text: string;
  Icon?: IconType;
  backgroundColor?: string;
  iconColor?: string;
}

export function InfoStrip({
  text,
  Icon = ShieldCheck,
  backgroundColor = AppColors.warningLight,
  iconColor = AppColors.primary,
}: InfoStripProps) {
  return (
    <View style={[styles.strip, { backgroundColor }]}>
      <Icon size={15} color={iconColor} strokeWidth={2} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
  },
  text: {
    flex: 1,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 12,
    lineHeight: 17,
    color: AppColors.textSecondary,
  },
});

export default InfoStrip;
