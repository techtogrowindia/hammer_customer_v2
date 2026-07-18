import { AppColors } from '@/core/theme/app-colors';
import { useRouter } from 'expo-router';
import { SearchX } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryItem } from '@/components/home/home.types';
import { CategoryGridItem } from '@/components/service/category/category-grid';
import { ALL_CATEGORIES, categoryImages } from '@/components/service/category/constants';
import { fontTokens } from '@/core/theme/typography';

const NUM_COLUMNS = 4;

export default function AllServicesScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const handleSelect = (id: string) => {
    router.push(`/service/service-item/${id}`);
  };

  return (
    <View style={[styles.screen]}>
      <FlatList<CategoryItem>
        data={ALL_CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item, index }) => (
          <CategoryGridItem
            category={item}
            imageUrl={categoryImages[index % categoryImages.length]}
            onPress={() => handleSelect(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <SearchX size={28} color={AppColors.textTertiary} strokeWidth={1.75} />
            <Text style={styles.emptyText}>No services available</Text>
          </View>
        }
      />
    </View>
  );
}

export const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },

  // Grid
  gridContent: { paddingHorizontal: 14, paddingBottom: 32 },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: AppColors.warningLight,
  },
  image: { width: '100%', height: '100%' },
  label: {
    marginTop: 8,
    fontFamily: font.medium,
    fontSize: 11,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 30 },
  emptyText: {
    marginTop: 10,
    fontFamily: font.regular,
    fontSize: 13,
    color: AppColors.textTertiary,
    textAlign: 'center',
  },
});
