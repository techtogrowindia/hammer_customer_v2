import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { CategoryItem } from '../home.types';

interface CategoryScrollerProps {
  categories: CategoryItem[];
  onSelect: (id: string) => void;
}

export function CategoryScroller({ categories, onSelect }: CategoryScrollerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((cat) => (
        <Pressable
          key={cat.id}
          accessibilityRole='button'
          onPress={() => onSelect(cat.id)}
          style={({ pressed }) => [styles.item, pressed && { opacity: 0.75 }]}
        >
          <CircleIcon Icon={cat.Icon} size={60} iconSize={22} />
          <Text style={styles.label}>{cat.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 18, paddingBottom: 28 },
  item: { alignItems: 'center', width: 72 },
  label: {
    marginTop: 8,
    fontFamily: fontTokens.fontFamily.medium,
    fontSize: 11,
    color: AppColors.textSecondary,
    textAlign: 'center',
    maxWidth: 68,
  },
});

export default CategoryScroller;
