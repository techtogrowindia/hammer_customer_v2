import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ChevronRight, Clock, Flame, Heart, Star } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

/**
 * Two fixes from the last pass:
 * 1. `card` had lost `backgroundColor` when the border was added, so
 *    the card was see-through against whatever sits behind the list —
 *    restored `backgroundColor: AppColors.white`, and eased the shadow
 *    slightly since a border + a heavy shadow together double up on
 *    edge definition.
 * 2. The circular plus-only button read as "add to cart," not "see
 *    more" — swapped for a labeled "View" pill with a chevron, so the
 *    action is unambiguous at a glance.
 */
export function ServiceCard({ service, onPress, isFavorite = false, onToggleFavorite }: ServiceCardProps) {
  const tagConfig = service.tag ? TAG_CONFIG[service.tag] : null;

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
        onPress={() => onToggleFavorite?.(service.id)}
        hitSlop={8}
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
        <View style={styles.iconBlock}>
          <service.Icon size={26} color={AppColors.primary} strokeWidth={2} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {service.name}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingChip}>
              <Star size={10} color={AppColors.white} strokeWidth={2} fill={AppColors.white} />
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
        <View style={styles.priceBlock}>
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
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardPressed: { backgroundColor: AppColors.warningLight },

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
  tagRibbonText: { fontFamily: 'Poppins_600SemiBold', fontSize: 9, color: AppColors.white },

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
    zIndex: 1,
  },

  topRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  topRowWithTag: { marginTop: 22 },
  iconBlock: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: AppColors.textPrimary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: AppColors.primary,
  },
  ratingChipText: { fontFamily: 'Poppins_600SemiBold', fontSize: 10, color: AppColors.white },
  reviews: { fontFamily: fontTokens.fontFamily.regular, fontSize: 11, color: AppColors.textSecondary },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  duration: { fontFamily: fontTokens.fontFamily.regular, fontSize: 11, color: AppColors.textTertiary },

  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: AppColors.divider,
  },
  priceBlock: {},
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  price: { fontFamily: 'Poppins_700Bold', fontSize: 17, color: AppColors.textPrimary },
  originalPrice: {
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 12,
    color: AppColors.textTertiary,
    textDecorationLine: 'line-through',
  },
  discountText: { marginTop: 2, fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: '#2E9E5B' },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 13,
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  viewBtnPressed: { backgroundColor: AppColors.primaryDark },
  viewBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: 12.5, color: AppColors.white },
});

export default ServiceCard;
