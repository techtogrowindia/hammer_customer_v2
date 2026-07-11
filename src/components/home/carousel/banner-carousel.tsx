import { AppColors } from '@/core/theme/app-colors';
import React, { useRef, useState } from 'react';
import {
  Animated,
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
  cardColor?: string;
}

export function BannerCarousel({ banners, horizontalInset = 20, cardColor = AppColors.primary }: BannerCarouselProps) {
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
        showsHorizontalScrollIndicator={false}
        snapToInterval={bannerWidth + 12}
        decelerationRate='fast'
        onMomentumScrollEnd={onBannerScrollEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        style={[styles.bannerScroll, { marginHorizontal: -horizontalInset }]}
        contentContainerStyle={[styles.bannerContent, { paddingHorizontal: horizontalInset }]}
      >
        {banners.map((b) => (
          <View key={b.id} style={[styles.bannerCard, { width: bannerWidth, backgroundColor: cardColor }]}>
            <View style={styles.bannerDecor} />
            <View style={styles.bannerTag}>
              <Text style={[styles.bannerTagText, { color: AppColors.primaryDark }]}>{b.tag}</Text>
            </View>
            <Text style={styles.bannerTitle}>{b.title}</Text>
            <Text style={styles.bannerSubtitle}>{b.subtitle}</Text>
          </View>
        ))}
      </Animated.ScrollView>
      <View style={styles.dots}>
        {banners.map((b, i) => (
          <View
            key={b.id}
            style={[styles.dot, bannerIndex === i && [styles.dotActive, { backgroundColor: cardColor }]]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bannerScroll: {},
  bannerContent: { gap: 12 },
  bannerCard: {
    height: 134,
    borderRadius: 22,
    padding: 18,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  bannerDecor: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -55,
    right: -35,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bannerTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: AppColors.white,
    marginBottom: 10,
  },
  bannerTagText: { fontFamily: 'Poppins_600SemiBold', fontSize: 10 },
  bannerTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 20, color: AppColors.secondary },
  bannerSubtitle: {
    marginTop: 3,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: AppColors.secondaryLight,
    opacity: 0.85,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12, marginBottom: 26 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: AppColors.divider },
  dotActive: { width: 18 },
});

export default BannerCarousel;
