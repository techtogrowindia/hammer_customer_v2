import { styles } from '@/app/(tabs)/(services)';
import { CategoryItem } from '@/components/home/home.types';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export function CategoryGridItem({
  category,
  imageUrl,
  onPress,
}: {
  category: CategoryItem;
  imageUrl: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole='button'
      onPress={onPress}
      style={({ pressed }) => [styles.gridItem, pressed && { opacity: 0.75 }]}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {category.label}
      </Text>
    </Pressable>
  );
}
