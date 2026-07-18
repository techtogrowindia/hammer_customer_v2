import { AppColors } from '@/core/theme/app-colors';
import { Award, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import { Technician } from './types';

export function TechnicianBadgeRow({ technician }: { technician: Technician }) {
  return (
    <View style={styles.techBadgeRow}>
      {technician.verified && (
        <View style={styles.techBadge}>
          <ShieldCheck size={11} color={AppColors.success} strokeWidth={2.5} />
          <Text style={[styles.techBadgeText, { color: AppColors.success }]}>Verified</Text>
        </View>
      )}
      {technician.premium && (
        <View style={[styles.techBadge, { backgroundColor: AppColors.warningLight }]}>
          <Award size={11} color={AppColors.primaryDark} strokeWidth={2.5} />
          <Text style={[styles.techBadgeText, { color: AppColors.primaryDark }]}>Premium</Text>
        </View>
      )}
    </View>
  );
}
