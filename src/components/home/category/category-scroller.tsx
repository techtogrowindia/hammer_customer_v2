import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategoryItem } from '../home.types';

interface CategoryScrollerProps {
  categories: CategoryItem[];
  onSelect: (id: string) => void;
}

const categoryImages = [
  'https://picsum.photos/id/1062/120/120',
  'https://picsum.photos/id/1074/120/120',
  'https://picsum.photos/id/1080/120/120',
  'https://picsum.photos/id/1084/120/120',
  'https://picsum.photos/id/1081/120/120',
  'https://picsum.photos/id/1067/120/120',
];

export function CategoryScroller({ categories, onSelect }: CategoryScrollerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((cat, index) => (
        <Pressable
          key={cat.id}
          accessibilityRole='button'
          onPress={() => onSelect(cat.id)}
          style={({ pressed }) => [styles.item, pressed && { opacity: 0.75 }]}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: categoryImages[index % categoryImages.length],
              }}
              style={styles.image}
            />
          </View>

          <Text style={styles.label}>{cat.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 18,
    paddingBottom: 28,
  },

  item: {
    alignItems: 'center',
    width: 72,
  },

  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: AppColors.warningLight,
  },

  image: {
    width: '100%',
    height: '100%',
  },

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
