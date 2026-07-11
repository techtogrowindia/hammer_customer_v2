import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { Star } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '../header/section-header';
import { ServiceItem } from '../home.types';

interface ServiceGridProps {
  services: ServiceItem[];
  onSelect: (id: string) => void;
  onSeeAll?: () => void;
  title?: string;
  actionLabel?: string;
  numColumns?: 2 | 3;
}

export function ServiceGrid({
  services,
  onSelect,
  onSeeAll,
  title = 'Most Booked',
  actionLabel = 'See all',
  numColumns = 2,
}: ServiceGridProps) {
  if (services.length === 0) return null;
  const cardWidth = numColumns === 2 ? '47%' : '31%';

  return (
    <>
      <SectionHeader title={title} actionLabel={actionLabel} onActionPress={onSeeAll} />
      <View style={styles.grid}>
        {services.map((service) => (
          <Pressable
            key={service.id}
            accessibilityRole='button'
            onPress={() => onSelect(service.id)}
            style={({ pressed }) => [
              styles.card,
              { width: cardWidth },
              pressed && { backgroundColor: AppColors.warningLight, borderColor: AppColors.warningLight },
            ]}
          >
            <CircleIcon Icon={service.Icon} size={52} iconSize={20} />
            <Text style={styles.name} numberOfLines={2}>
              {service.name}
            </Text>
            <View style={styles.meta}>
              <Star size={10} color={AppColors.primary} strokeWidth={2} fill={AppColors.primary} />
              <Text style={styles.rating}>{service.rating}</Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.bookings}>{service.bookings}</Text>
            </View>
            <Text style={styles.price}>{service.price}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  card: {
    padding: 14,
    borderRadius: 18,
    alignItems: 'flex-start',
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  name: { marginTop: 10, fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: AppColors.textPrimary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  rating: { fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: AppColors.textPrimary },
  dot: { fontSize: 11, color: AppColors.textTertiary },
  bookings: { fontFamily: fontTokens.fontFamily.regular, fontSize: 11, color: AppColors.textSecondary },
  price: { marginTop: 10, fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: AppColors.primary },
});

export default ServiceGrid;
