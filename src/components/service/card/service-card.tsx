import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { GetGCServicesResponse } from '@/domain/models/service-categories/getCategoriesResponse';
import { ArrowRight, Heart } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ServiceCardProps {
  service: GetGCServicesResponse;
  onPress: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  width?: string | number;
}

const PLACEHOLDER = 'https://hammer-assets.s3.ap-south-1.amazonaws.com/images/category-placeholder.png';

export function ServiceCard({
  service,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  width = '48%',
}: ServiceCardProps) {
  const [image, setImage] = useState(service?.image || PLACEHOLDER);

  return (
    <Pressable
      accessibilityRole='button'
      style={({ pressed }) => [styles.card, { width }, pressed && styles.cardPressed]}
      onPress={() => onPress(String(service?.id ?? ''))}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode='cover' onError={() => setImage(PLACEHOLDER)} />

        <Pressable
          hitSlop={10}
          style={styles.favoriteBtn}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(String(service?.id ?? ''));
          }}
        >
          <Heart
            size={15}
            strokeWidth={2}
            color={isFavorite ? AppColors.error : AppColors.white}
            fill={isFavorite ? AppColors.error : 'transparent'}
          />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {service?.service_name || 'Service'}
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
    opacity: 0.9,
  },

  imageContainer: {
    height: 110,
    backgroundColor: AppColors.warningLight,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  body: {
    padding: 12,
  },

  name: {
    minHeight: 38,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: AppColors.textPrimary,
  },

  bookBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: AppColors.primary,
  },

  bookBtnText: {
    fontFamily: fontTokens.fontFamily.medium,
    fontSize: 11,
    color: AppColors.white,
  },
});

export default ServiceCard;
