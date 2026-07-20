import { CategorySection } from '@/components/service/category/category-section/category-section';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { GCSubCategory } from '@/domain/models/service-categories/getCategoriesResponse';
import { useBoundStore } from '@/store/boundStore';
import { useRouter } from 'expo-router';
import { SearchX } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

export default function AllServicesScreen() {
  const router = useRouter();

  const { categories } = useBoundStore(
    useShallow((state) => ({
      categories: state.categoryList,
    })),
  );
  const handleSelectSubcategory = (sub: GCSubCategory) => {
    router.push({
      pathname: '/service/service-item/[service-item-id]',
      params: {
        'service-item-id': String(sub.id),
        title: sub?.name,
      },
    });
  };

  if (!categories.length) {
    return (
      <View style={styles.emptyWrap}>
        <SearchX size={28} color={AppColors.textTertiary} strokeWidth={1.75} />
        <Text style={styles.emptyText}>No services available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => <CategorySection category={item} onSelectSubcategory={handleSelectSubcategory} />}
      removeClippedSubviews={true}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 32, backgroundColor: AppColors.background },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  emptyText: {
    marginTop: 10,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 13,
    color: AppColors.textTertiary,
    textAlign: 'center',
  },
});
