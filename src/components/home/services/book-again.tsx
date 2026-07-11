import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { RotateCcw } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '../header/section-header';
import { BookAgainItem } from '../home.types';

interface BookAgainListProps {
  items: BookAgainItem[];
  onSeeAll?: () => void;
  onRebook: (id: string) => void;
  title?: string;
  actionLabel?: string;
}

export function BookAgainList({
  items,
  onSeeAll,
  onRebook,
  title = 'Book Again',
  actionLabel = 'History',
}: BookAgainListProps) {
  if (items.length === 0) return null;

  return (
    <>
      <SectionHeader title={title} actionLabel={actionLabel} onActionPress={onSeeAll} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <CircleIcon Icon={item.Icon} size={50} iconSize={20} />
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.date}>{item.lastDate}</Text>
            <Pressable
              onPress={() => onRebook(item.id)}
              style={({ pressed }) => [styles.rebookBtn, pressed && { backgroundColor: AppColors.primaryDark }]}
            >
              <RotateCcw size={12} color={AppColors.white} strokeWidth={2.25} />
              <Text style={styles.rebookBtnText}>Rebook</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12, paddingBottom: 28 },
  card: {
    width: 138,
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  name: {
    marginTop: 10,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  date: {
    marginTop: 2,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 10,
    color: AppColors.textTertiary,
    textAlign: 'center',
  },
  rebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
  },
  rebookBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: AppColors.white },
});

export default BookAgainList;
