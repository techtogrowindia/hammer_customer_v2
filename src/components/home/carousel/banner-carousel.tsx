import { AppColors } from '@/core/theme/app-colors';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { BannerItem } from '../home.types';

interface BannerCarouselProps {
  banners: BannerItem[];
  horizontalInset?: number;
}

export function BannerCarousel({ banners, horizontalInset = 20 }: BannerCarouselProps) {
  const { width } = useWindowDimensions();
  const bannerWidth = width - horizontalInset * 2;

  const scrollX = useRef(new Animated.Value(0)).current;
  const [bannerIndex, setBannerIndex] = useState(0);

  const onBannerScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setBannerIndex(Math.round(e.nativeEvent.contentOffset.x / bannerWidth));
  };

  if (banners.length === 0) return null;

  return (
    <>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        snapToInterval={bannerWidth + 12}
        decelerationRate='fast'
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onBannerScrollEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        style={[styles.bannerScroll, { marginHorizontal: -horizontalInset }]}
        contentContainerStyle={[styles.bannerContent, { paddingHorizontal: horizontalInset }]}
      >
        {banners.map((banner, index) => (
          <View key={banner.id} style={[styles.bannerCard, { width: bannerWidth }]}>
            <Image
              source={{ uri: banner.image }}
              style={styles.bannerImage}
            />

            <View style={styles.overlay} />

            <View style={styles.content}>
              <View style={styles.bannerTag}>
                <Text style={styles.bannerTagText}>{banner.tag}</Text>
              </View>

              <Text style={styles.bannerTitle}>{banner.title}</Text>

              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.dots}>
        {banners.map((_, index) => (
          <View key={index} style={[styles.dot, bannerIndex === index && styles.dotActive]} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bannerScroll: {},

  bannerContent: {
    gap: 12,
  },

  bannerCard: {
    height: 180,
    borderRadius: 22,
    overflow: 'hidden',
  },

  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  bannerTag: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },

  bannerTagText: {
    color: AppColors.white,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
  },

  bannerTitle: {
    color: AppColors.white,
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
  },

  bannerSubtitle: {
    marginTop: 6,
    color: AppColors.white,
    opacity: 0.9,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 26,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.divider,
  },

  dotActive: {
    width: 18,
    backgroundColor: AppColors.primary,
  },
});

export default BannerCarousel;
