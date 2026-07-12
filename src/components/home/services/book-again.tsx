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

/**
 * ALTERNATIVE DESIGN — "Banner block card"
 * The icon fills a full-width tinted block across the top of the card
 * (like a product photo would), name/date sit below it, and Rebook is
 * a full-width button flush with the card's bottom edge rather than an
 * inline pill under the text. Reads closer to a small product/shop
 * card than a profile-style tile — the icon gets much more visual
 * presence since it's not competing for space with text on the same
 * row or being boxed into a small circle.
 */
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
            <View style={styles.iconBanner}>
              <item.Icon size={30} color={AppColors.primary} strokeWidth={1.75} />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.date} numberOfLines={1}>
                {item.lastDate}
              </Text>
            </View>

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
    width: 150,
    borderRadius: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    overflow: 'hidden',
  },
  iconBanner: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  textWrap: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: AppColors.textPrimary,
  },
  date: {
    marginTop: 2,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 10,
    color: AppColors.textTertiary,
  },
  rebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    backgroundColor: AppColors.primary,
  },
  rebookBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: AppColors.white },
});

export default BookAgainList;
