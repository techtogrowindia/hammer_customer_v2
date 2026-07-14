import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ChevronRight, Clock, Flame, Heart, Star } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type IconType = typeof Flame;

export interface ServiceCardData {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  discountPercent?: number;
  rating: string;
  reviews: string;
  duration: string;
  tag?: 'bestseller' | 'trending' | 'new';
  Icon: IconType;
}

interface ServiceCardProps {
  service: ServiceCardData;
  onPress: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const TAG_CONFIG = {
  bestseller: { label: 'Bestseller', color: AppColors.primary },
  trending: { label: 'Trending', color: '#E8622C' },
  new: { label: 'New', color: '#2E9E5B' },
};

const serviceImages = [
  'https://picsum.photos/id/1015/200/200',
  'https://picsum.photos/id/1025/200/200',
  'https://picsum.photos/id/1035/200/200',
  'https://picsum.photos/id/1043/200/200',
  'https://picsum.photos/id/1050/200/200',
  'https://picsum.photos/id/1060/200/200',
];

export function ServiceCard({ service, onPress, isFavorite = false, onToggleFavorite }: ServiceCardProps) {
  const tagConfig = service.tag ? TAG_CONFIG[service.tag] : null;

  const imageUri = serviceImages[parseInt(service.id, 10) % serviceImages.length || 0];

  return (
    <Pressable
      accessibilityRole='button'
      onPress={() => onPress(service.id)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {tagConfig && (
        <View style={[styles.tagRibbon, { backgroundColor: tagConfig.color }]}>
          <Flame size={10} color={AppColors.white} strokeWidth={2.5} />
          <Text style={styles.tagRibbonText}>{tagConfig.label}</Text>
        </View>
      )}

      <Pressable
        accessibilityRole='button'
        hitSlop={8}
        onPress={() => onToggleFavorite?.(service.id)}
        style={styles.favoriteBtn}
      >
        <Heart
          size={16}
          color={isFavorite ? AppColors.error : AppColors.textTertiary}
          fill={isFavorite ? AppColors.error : 'transparent'}
          strokeWidth={2}
        />
      </Pressable>

      <View style={[styles.topRow, tagConfig && styles.topRowWithTag]}>
        <View style={styles.imageBlock}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode='cover' />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {service.name}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingChip}>
              <Star size={10} color={AppColors.white} fill={AppColors.white} strokeWidth={2} />
              <Text style={styles.ratingChipText}>{service.rating}</Text>
            </View>

            <Text style={styles.reviews}>{service.reviews} reviews</Text>
          </View>

          <View style={styles.durationRow}>
            <Clock size={11} color={AppColors.textTertiary} strokeWidth={2} />
            <Text style={styles.duration}>{service.duration}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{service.price}</Text>

            {service.originalPrice && <Text style={styles.originalPrice}>{service.originalPrice}</Text>}
          </View>

          {service.discountPercent && <Text style={styles.discountText}>{service.discountPercent}% off</Text>}
        </View>

        <Pressable
          accessibilityRole='button'
          onPress={() => onPress(service.id)}
          style={({ pressed }) => [styles.viewBtn, pressed && styles.viewBtnPressed]}
        >
          <Text style={styles.viewBtnText}>View</Text>

          <ChevronRight size={14} color={AppColors.white} strokeWidth={2.5} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  cardPressed: {
    backgroundColor: AppColors.warningLight,
  },

  tagRibbon: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomRightRadius: 12,
  },

  tagRibbonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 9,
    color: AppColors.white,
  },

  favoriteBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
    zIndex: 10,
  },

  topRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },

  topRowWithTag: {
    marginTop: 22,
  },

  imageBlock: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: AppColors.warningLight,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: AppColors.textPrimary,
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },

  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: AppColors.primary,
  },

  ratingChipText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: AppColors.white,
  },

  reviews: {
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.textSecondary,
  },

  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  duration: {
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.textPrimary,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: AppColors.divider,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },

  price: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    color: AppColors.textPrimary,
  },

  originalPrice: {
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 12,
    color: AppColors.textTertiary,
    textDecorationLine: 'line-through',
  },

  discountText: {
    marginTop: 2,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: '#2E9E5B',
  },

  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 13,
    backgroundColor: AppColors.primary,
  },

  viewBtnPressed: {
    backgroundColor: AppColors.primaryDark,
  },

  viewBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12.5,
    color: AppColors.white,
  },
});

export default ServiceCard;
