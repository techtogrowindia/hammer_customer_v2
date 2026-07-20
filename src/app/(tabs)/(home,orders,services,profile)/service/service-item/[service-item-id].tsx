import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { InfoStrip } from '@/components/home/banner-promo/info-strip';
import { ServiceCard } from '@/components/service/card/service-card';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useBoundStore } from '@/store/boundStore';
import { router, useLocalSearchParams } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
};

export default function ServiceItemScreen() {
  const params = useLocalSearchParams<{ 'service-item-id'?: string }>();

  const { categoryList } = useBoundStore(
    useShallow((state) => ({
      categoryList: state.categoryList,
    })),
  );
  const serviceList = categoryList
    .flatMap((category) => category.subcategories ?? [])
    .find((sub) => String(sub.id) === params['service-item-id'])?.services;

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const goToService = (serviceId: string) => {
    router.push({
      pathname: '/service/service-details/[service-details-id]',
      params: {
        'service-details-id': serviceId,
        subCategoryId: params?.['service-item-id'],
      },
    });
  };
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.body}>
        {serviceList?.length === 0 ? (
          <View style={styles.emptyState}>
            <CircleIcon Icon={Search} size={72} iconSize={26} />
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptySubtitle}>Try a different category</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {serviceList?.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={goToService}
                isFavorite={favorites.has(String(service.id))}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </View>
        )}

        <InfoStrip text='All professionals are background-verified for your safety' />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  chipScroll: { flexGrow: 0, marginBottom: 16 },
  chipRow: { gap: 8, paddingRight: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  chipActive: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  chipLabel: { fontFamily: font.medium, fontSize: 12.5, color: AppColors.textSecondary },
  chipLabelActive: { fontFamily: font.semiBold, color: AppColors.white },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 24,
  },

  emptyState: { alignItems: 'center', paddingVertical: 56 },
  emptyTitle: { marginTop: 16, fontFamily: font.bold, fontSize: 18, color: AppColors.textPrimary },
  emptySubtitle: { marginTop: 8, fontFamily: font.regular, fontSize: 13, color: AppColors.textSecondary },
});
