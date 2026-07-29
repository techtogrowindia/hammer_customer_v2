import { LEGAL_LINKS } from '@/core/constants/legal';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useBoundStore } from '@/store/boundStore';
import { router } from 'expo-router';
import { ArrowRight, CalendarCheck2, ClipboardList, Wrench } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';

type Slide = {
  id: string;
  title: string;
  description: string;
  variant: 'setup' | 'booking' | 'tracking';
  Icon: typeof Wrench;
  image: string;
};
const slides: Slide[] = [
  {
    id: 'setup',
    title: 'Book trusted home services',
    description: 'Choose repair, cleaning, plumbing, electrical, and more from one simple place.',
    variant: 'setup',
    Icon: Wrench,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900',
  },
  {
    id: 'booking',
    title: 'Stay on top of every booking.',
    description: 'Get clear updates about your professional, schedule, and service status.',
    variant: 'booking',
    Icon: CalendarCheck2,
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=900',
  },
  {
    id: 'tracking',
    title: 'Reach your home goals with ease.',
    description: 'Track visits, compare trusted providers, and keep your home running smoothly.',
    variant: 'tracking',
    Icon: ClipboardList,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900',
  },
];

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const setHasOnBoardCompleted = useBoundStore(useShallow((state) => state.setHasOnBoardCompleted));
  const listRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === slides.length - 1;

  const goToOtp = () => {
    router.replace('/otp/generate-otp');
  };
  const goToPermissionScreen = () => {
    router.replace('/(auth)/permission/location');
  };

  const goNext = () => {
    if (isLastSlide) {
      setHasOnBoardCompleted(true);
      goToOtp();
      return;
    }

    listRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(nextIndex);
  };
  const openPrivacyPolicy = () => {
    Linking.openURL(LEGAL_LINKS.privacy.url);
  };

  const openTerms = () => {
    Linking.openURL(LEGAL_LINKS.terms.url);
  };
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      {!isLastSlide && (
        <Pressable
          accessibilityRole='button'
          onPress={goToOtp}
          style={({ pressed }) => [styles.skipButton, pressed && styles.skipButtonPressed]}
          hitSlop={8}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      <Animated.FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => <OnboardSlide index={index} item={item} scrollX={scrollX} width={width} />}
      />

      <View style={styles.footer}>
        <Pagination currentIndex={currentIndex} />

        <Pressable
          accessibilityRole='button'
          onPress={goNext}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
          <ArrowRight size={18} color={AppColors.white} strokeWidth={2.25} />
        </Pressable>
        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.link} onPress={openTerms}>
            Terms
          </Text>{' '}
          &{' '}
          <Text style={styles.link} onPress={openPrivacyPolicy}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

function OnboardSlide({
  item,
  index,
  scrollX,
  width,
}: {
  item: Slide;
  index: number;
  scrollX: Animated.Value;
  width: number;
}) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const mockupStyle = {
    opacity: scrollX.interpolate({
      inputRange,
      outputRange: [0.45, 1, 0.45],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: scrollX.interpolate({
          inputRange,
          outputRange: [22, 0, 22],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: scrollX.interpolate({
          inputRange,
          outputRange: [0.92, 1, 0.92],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const textStyle = {
    opacity: scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: scrollX.interpolate({
          inputRange,
          outputRange: [18, 0, 18],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const Icon = item.Icon;

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.mockupStage, mockupStyle]}>
        <Image source={{ uri: item.image }} style={styles.onboardingImage} resizeMode='cover' />
      </Animated.View>

      <Animated.View style={[styles.copyWrap, textStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
}

function Pagination({ currentIndex }: { currentIndex: number }) {
  return (
    <View style={styles.pagination}>
      {slides.map((slide, index) => (
        <View key={slide.id} style={[styles.dot, currentIndex === index && styles.activeDot]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  skipButtonPressed: {
    backgroundColor: AppColors.warningLight,
  },
  skipText: {
    fontFamily: font.medium,
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  mockupStage: {
    height: 350,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    backgroundColor: AppColors.warningLight,
    borderRadius: 24,
    overflow: 'hidden',
  },
  mockupMotion: {
    width: 280,
    height: 330,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 176,
    height: 176,
    borderRadius: 88,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
  },
  ringInner: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  orbitDot: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.divider,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  orbitDotTop: {
    top: 4,
    right: 4,
  },
  copyWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 38,
  },
  title: {
    maxWidth: 330,
    fontFamily: font.bold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  description: {
    maxWidth: 322,
    marginTop: 16,
    fontFamily: font.regular,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    alignItems: 'center',
    paddingHorizontal: 34,
  },
  pagination: {
    height: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 28,
  },
  dot: {
    width: 18,
    height: 5,
    borderRadius: 3,
    backgroundColor: AppColors.divider,
  },
  activeDot: {
    width: 26,
    backgroundColor: AppColors.primary,
  },
  primaryButton: {
    width: '100%',
    maxWidth: 306,
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 9 },
    elevation: 3,
  },
  primaryButtonPressed: {
    backgroundColor: AppColors.primaryDark,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    fontFamily: font.semiBold,
    fontSize: 16,
    lineHeight: 22,
    color: AppColors.white,
  },
  terms: {
    marginTop: 14,
    fontFamily: font.regular,
    fontSize: 9,
    lineHeight: 13,
    color: AppColors.textTertiary,
    textAlign: 'center',
  },
  onboardingImage: {
    width: '100%',
    height: '100%',
  },
  link: {
    color: AppColors.primary,
    fontFamily: font.medium,
    textDecorationLine: 'underline',
  },
});
