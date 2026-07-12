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

/**
 * ALTERNATIVE DESIGN — "Banner block card"
 * Icon fills a full-width tinted block across the top (same treatment
 * as the BookAgainList banner variant), with a rating badge overlaid
 * on its bottom-right corner. Name/bookings/price stack below in the
 * card body. If you use both ServiceGrid and BookAgainList on the same
 * screen, this keeps their visual language consistent instead of one
 * being circle-icon-centered and the other being a banner block.
 */
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
            style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && styles.cardPressed]}
          >
            <View style={styles.iconBanner}>
              <service.Icon size={26} color={AppColors.primary} strokeWidth={1.75} />
              <View style={styles.ratingBadge}>
                <Star size={9} color={AppColors.white} strokeWidth={2} fill={AppColors.white} />
                <Text style={styles.ratingBadgeText}>{service.rating}</Text>
              </View>
            </View>

            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={2}>
                {service.name}
              </Text>
              <Text style={styles.bookings} numberOfLines={1}>
                {service.bookings}
              </Text>
              <Text style={styles.price}>{service.price}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  card: {
    borderRadius: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    overflow: 'hidden',
  },
  cardPressed: { backgroundColor: AppColors.warningLight, borderColor: AppColors.warningLight },
  iconBanner: {
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: AppColors.primary,
  },
  ratingBadgeText: { fontFamily: 'Poppins_600SemiBold', fontSize: 9, color: AppColors.white },
  body: { padding: 12 },
  name: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: AppColors.textPrimary },
  bookings: {
    marginTop: 4,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.textSecondary,
  },
  price: { marginTop: 8, fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: AppColors.primary },
});

export default ServiceGrid;
