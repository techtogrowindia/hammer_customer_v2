import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ArrowRight, Flame, Heart } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type IconType = typeof Flame;

export interface ServiceCardData {
  id: string;
  name: string;
  category: string;
  description?: string;
  tag?: 'bestseller' | 'trending' | 'new';
  Icon: IconType;
  price?: string;
  originalPrice?: string;
  discountPercent?: number;
  rating?: string;
  reviews?: string;
  duration?: string;
}

interface ServiceCardProps {
  service: ServiceCardData;
  onPress: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  width?: string | number;
}

const TAG_CONFIG = {
  bestseller: { label: 'Bestseller', color: AppColors.error },
  trending: { label: 'Trending', color: AppColors.info },
  new: { label: 'New', color: AppColors.success },
};

const CATEGORY_IMAGES: Record<string, string> = {
  cleaning: 'https://loremflickr.com/400/300/bathroom',
  electrical: 'https://loremflickr.com/400/300/electrician,wiring',
  plumbing: 'https://loremflickr.com/400/300/plumber,pipe',
  repair: 'https://loremflickr.com/400/300/appliance,repair',
  painting: 'https://loremflickr.com/400/300/housepainting,paintroller',
  salon: 'https://loremflickr.com/400/300/haircut,barber',
  laundry: 'https://loremflickr.com/400/300/laundry,ironing',
  power: 'https://loremflickr.com/400/300/generator,powertools',
};
const DEFAULT_IMAGE = 'https://loremflickr.com/400/300/homeservice,handyman';

export function ServiceCard({
  service,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  width = '48%',
}: ServiceCardProps) {
  const tagConfig = service.tag ? TAG_CONFIG[service.tag] : null;
  const imageUri = CATEGORY_IMAGES[service.category] ?? DEFAULT_IMAGE;
  const { Icon } = service;

  return (
    <Pressable
      accessibilityRole='button'
      onPress={() => onPress(service.id)}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.cardPressed]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode='cover' />

        {tagConfig && (
          <View style={[styles.tagBadge, { backgroundColor: tagConfig.color }]}>
            <Text style={styles.tagBadgeText}>{tagConfig.label}</Text>
          </View>
        )}

        <Pressable
          accessibilityRole='button'
          hitSlop={8}
          onPress={() => onToggleFavorite?.(service.id)}
          style={styles.favoriteBtn}
        >
          <Heart
            size={14}
            color={isFavorite ? AppColors.error : AppColors.white}
            fill={isFavorite ? AppColors.error : 'transparent'}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        {/* <View style={styles.iconWrap}>
          <Icon size={16} color={AppColors.primary} strokeWidth={2.25} />
        </View> */}

        <Text style={styles.name} numberOfLines={1}>
          {service.name}
        </Text>

        <Text style={styles.description} numberOfLines={1}>
          {service.description ?? 'Verified & background-checked pros'}
        </Text>

        <View style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Book</Text>
          <ArrowRight size={12} color={AppColors.white} strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.divider,
    overflow: 'hidden',
  },

  cardPressed: {
    opacity: 0.92,
  },

  imageContainer: {
    height: 100,
    position: 'relative',
    backgroundColor: AppColors.warningLight,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  tagBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },

  tagBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 8.5,
    color: AppColors.white,
  },

  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  body: {
    padding: 12,
  },

  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
    marginBottom: 8,
  },

  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: AppColors.textPrimary,
  },

  description: {
    marginTop: 2,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.textSecondary,
  },

  bookBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: AppColors.primary,
  },

  bookBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: AppColors.white,
  },
});

export default ServiceCard;
