import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconType } from '../home.types';

interface InfoStripProps {
  text: string;
  Icon?: IconType;
  tagColor?: string;
  iconColor?: string;
}

export function InfoStrip({
  text,
  Icon = ShieldCheck,
  tagColor = AppColors.primary,
  iconColor = AppColors.white,
}: InfoStripProps) {
  return (
    <View style={styles.strip}>
      <View style={[styles.tag, { backgroundColor: tagColor }]}>
        <Icon size={16} color={iconColor} strokeWidth={2.25} />
      </View>
      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    overflow: 'hidden',
  },
  tag: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontFamily: fontTokens.fontFamily.medium,
    fontSize: 12,
    lineHeight: 17,
    color: AppColors.textPrimary,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
});

export default InfoStrip;
