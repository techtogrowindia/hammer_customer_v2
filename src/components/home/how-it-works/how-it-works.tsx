import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '../header/section-header';
import { HowItWorksStep } from '../home.types';

interface StepRowProps {
  steps: HowItWorksStep[];
  title?: string;
}

export function StepRow({ steps, title = 'How It Works' }: StepRowProps) {
  if (steps.length === 0) return null;

  return (
    <>
      <SectionHeader title={title} withMargin />
      <View style={styles.row}>
        {steps.map((item, i) => (
          <Fragment key={item.id}>
            <View style={styles.item}>
              <CircleIcon Icon={item.Icon} size={54} iconSize={21} />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            {i < steps.length - 1 && <View style={styles.connector} />}
          </Fragment>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 },
  item: { alignItems: 'center', width: 84 },
  label: {
    marginTop: 8,
    fontFamily: fontTokens.fontFamily.medium,
    fontSize: 11,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  connector: { flex: 1, height: 1.5, marginTop: 27, backgroundColor: AppColors.textTertiary },
});

export default StepRow;
