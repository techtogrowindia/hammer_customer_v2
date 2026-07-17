import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
      <SectionHeader title={title} onActionPress={onSeeAll} />

      <View style={styles.grid}>
        {services.map((service, index) => (
          <Pressable
            key={service.id}
            accessibilityRole='button'
            onPress={() => onSelect(service.id)}
            style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && styles.cardPressed]}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: `https://picsum.photos/400/250?random=${index + 1}`,
                }}
                style={styles.image}
                resizeMode='cover'
              />

              {/* <View style={styles.ratingBadge}>
                <Star size={9} color={AppColors.white} fill={AppColors.white} strokeWidth={2} />
                <Text style={styles.ratingBadgeText}>{service.rating}</Text>
              </View> */}
            </View>

            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={2}>
                {service.name}
              </Text>

              <Text style={styles.bookings} numberOfLines={1}>
                {service.bookings}
              </Text>

              {/* <Text style={styles.price}>{service.price}</Text> */}
            </View>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },

  card: {
    borderRadius: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    overflow: 'hidden',
  },

  cardPressed: {
    opacity: 0.9,
  },

  imageContainer: {
    height: 110,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
  },

  ratingBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    color: AppColors.white,
  },

  body: {
    padding: 12,
  },

  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: AppColors.textPrimary,
  },

  bookings: {
    marginTop: 4,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.textSecondary,
  },

  price: {
    marginTop: 8,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: AppColors.primary,
  },
});

export default ServiceGrid;
