import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatItem } from '../profile.types';

interface StatsRowProps {
  stats: StatItem[];
}

export function StatsRow({ stats }: StatsRowProps) {
  if (stats.length === 0) return null;

  return (
    <View style={styles.card}>
      {stats.map((stat, i) => (
        <Fragment key={stat.label}>
          <View style={styles.item}>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
          {i < stats.length - 1 && <View style={styles.divider} />}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    paddingVertical: 16,
    backgroundColor: AppColors.white,
    marginBottom: 16,
  },
  item: { flex: 1, alignItems: 'center' },
  value: { fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: AppColors.textPrimary },
  label: { marginTop: 3, fontFamily: fontTokens.fontFamily.regular, fontSize: 11, color: AppColors.textSecondary },
  divider: { width: 1, height: 28, backgroundColor: AppColors.divider },
});

export default StatsRow;
