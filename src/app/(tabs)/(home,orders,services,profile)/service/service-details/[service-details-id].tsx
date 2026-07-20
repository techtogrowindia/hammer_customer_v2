import { Spacer } from '@/components/common/spacer/Spacer';
import { SectionHeader } from '@/components/home/header/section-header';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useBoundStore } from '@/store/boundStore';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Award, Check, ChevronRight, Clock, Heart, ShieldCheck } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

// TODO: replace with the actual service image (local asset or a prop passed
// in via useLocalSearchParams / a services data lookup keyed by params.id).
const SERVICE_IMAGE_URL = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop';

// TODO: replace with the actual service description (data lookup keyed by
// params.id), same as SERVICE_IMAGE_URL above.
const SERVICE_DESCRIPTION =
  'Our bathroom deep cleaning service covers every surface — tiles, fixtures, grout, mirrors, and drains — using professional-grade, eco-friendly products. Our trained and background-verified professionals bring their own equipment, so there is nothing for you to arrange. Ideal for move-ins, festival prep, or a seasonal reset, this service leaves your bathroom looking and feeling brand new, backed by a 48-hour re-service guarantee if anything falls short.';

type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
};

const includedItems = [
  'Professional carries own equipment',
  'Eco-friendly cleaning products',
  'Trained & background-verified staff',
  '48-hour re-service guarantee',
];

const HERO_MAX_HEIGHT = 180;
const HERO_MIN_HEIGHT = 64;
const COLLAPSE_RANGE = HERO_MAX_HEIGHT - HERO_MIN_HEIGHT;
const DESCRIPTION_COLLAPSED_LINES = 3;

export default function ServiceDetailsScreen() {
  const { top } = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    'service-details-id'?: string;
    subCategoryId?: string;
  }>();

  const serviceId = params['service-details-id'];
  const subCategoryId = params.subCategoryId;
  const { categories } = useBoundStore(
    useShallow((state) => ({
      categories: state.categoryList,
    })),
  );

  const subCategory = categories
    .filter((category) => category.subcategories?.some((sub) => String(sub.id) === subCategoryId))
    .flatMap((category) => category.subcategories ?? [])
    .find((sub) => String(sub.id) === subCategoryId);

  const service = subCategory?.services?.find((service) => String(service.id) === serviceId);

  const [isFavorite, setIsFavorite] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const goToBooking = () => {
    router.push({ pathname: '/booking/12', params: { id: params?.['service-details-id'] ?? '' } } as never);
  };

  const heroHeight = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE],
    outputRange: [HERO_MAX_HEIGHT + top, HERO_MIN_HEIGHT + top],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_RANGE * 0.5, COLLAPSE_RANGE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle='light-content' backgroundColor={AppColors.primary} translucent={false} />

      <Animated.View style={[styles.hero, { height: heroHeight }]}>
        <Animated.Image
          source={{ uri: SERVICE_IMAGE_URL }}
          resizeMode='cover'
          style={[StyleSheet.absoluteFillObject, { opacity: imageOpacity }]}
        />

        <Animated.View style={[styles.heroOverlay, { opacity: imageOpacity }]} />

        <View style={[styles.heroTopRow, { paddingTop: top + 12 }]}>
          <Pressable
            accessibilityRole='button'
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.8 }]}
            hitSlop={8}
          >
            <ArrowLeft size={19} color={AppColors.white} strokeWidth={2.25} />
          </Pressable>

          <Animated.Text style={[styles.compactTitle, { opacity: compactTitleOpacity }]} numberOfLines={1}>
            {service?.service_name ?? 'Service Details'}
          </Animated.Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              accessibilityRole='button'
              onPress={() => setIsFavorite((v) => !v)}
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.8 }]}
              hitSlop={8}
            >
              <Heart
                size={17}
                color={AppColors.white}
                fill={isFavorite ? AppColors.white : 'transparent'}
                strokeWidth={2}
              />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
      >
        <View style={styles.body}>
          <View style={styles.titleBlock}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{subCategory?.name ?? ''}</Text>
            </View>
            <Text style={styles.title}>{service?.service_name ?? 'Service Details'}</Text>
          </View>

          <SectionHeader title='Description' />
          <View style={styles.descriptionCard}>
            <Text
              style={styles.descriptionText}
              numberOfLines={descriptionExpanded ? undefined : DESCRIPTION_COLLAPSED_LINES}
            >
              {SERVICE_DESCRIPTION}
            </Text>
            <Pressable
              accessibilityRole='button'
              onPress={() => setDescriptionExpanded((v) => !v)}
              hitSlop={6}
              style={styles.readMoreBtn}
            >
              <Text style={styles.readMoreText}>{descriptionExpanded ? 'Read less' : 'Read more'}</Text>
            </Pressable>
          </View>

          <SectionHeader title="What's included" />
          <View style={styles.includedCard}>
            {includedItems.map((item, index) => (
              <View
                key={item}
                style={[styles.includedRow, index !== includedItems.length - 1 && styles.includedRowDivider]}
              >
                <View style={styles.checkWrap}>
                  <Check size={12} color={AppColors.primary} strokeWidth={2.5} />
                </View>
                <Text style={styles.includedText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Trust strip */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <ShieldCheck size={18} color={AppColors.primary} strokeWidth={2} />
              <Text style={styles.trustText}>Verified pro</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Award size={18} color={AppColors.primary} strokeWidth={2} />
              <Text style={styles.trustText}>Quality assured</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Clock size={18} color={AppColors.primary} strokeWidth={2} />
              <Text style={styles.trustText}>On-time service</Text>
            </View>
          </View>
        </View>
        <Spacer size={200} />
      </Animated.ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bookingBar}>
        <Pressable
          accessibilityRole='button'
          onPress={goToBooking}
          style={({ pressed }) => [styles.bookNowBtn, pressed && styles.bookNowBtnPressed]}
        >
          <Text style={styles.bookNowBtnText}>Book Now</Text>
          <ChevronRight size={17} color={AppColors.white} strokeWidth={2.25} />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },

  // Collapsing hero
  hero: {
    backgroundColor: AppColors.primary,
    overflow: 'hidden',
    zIndex: 10,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${AppColors.secondary}4D`,
  },

  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  compactTitle: {
    flex: 1,
    marginHorizontal: 12,
    fontFamily: font.semiBold,
    fontSize: 15,
    color: AppColors.white,
    textAlign: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  body: { paddingHorizontal: 20, paddingTop: 20 },

  // Title block
  titleBlock: { marginBottom: 24 },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: AppColors.warningLight,
    marginBottom: 8,
  },
  categoryTagText: { fontFamily: font.semiBold, fontSize: 11, color: AppColors.primaryDark },
  title: { fontFamily: font.bold, fontSize: 21, color: AppColors.textPrimary },

  // Description
  descriptionCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 24,
  },
  descriptionText: { fontFamily: font.regular, fontSize: 13, lineHeight: 20, color: AppColors.textSecondary },
  readMoreBtn: { marginTop: 8, alignSelf: 'flex-start' },
  readMoreText: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.primary },

  // Included
  includedCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    overflow: 'hidden',
    marginBottom: 24,
  },
  includedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13 },
  includedRowDivider: { borderBottomWidth: 1, borderBottomColor: AppColors.divider },
  checkWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  includedText: { flex: 1, fontFamily: font.regular, fontSize: 12.5, color: AppColors.textPrimary },

  // Trust
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingVertical: 16,
    marginBottom: 24,
  },
  trustItem: { flex: 1, alignItems: 'center', gap: 6 },
  trustText: { fontFamily: font.medium, fontSize: 10.5, color: AppColors.textSecondary, textAlign: 'center' },
  trustDivider: { width: 1, height: 28, backgroundColor: AppColors.divider },

  // Sticky booking bar — single full-width CTA, so no space-between/flex
  // tricks needed; the button itself stretches to fill the bar.
  bookingBar: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: AppColors.surface,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 52,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  bookNowBtnPressed: { backgroundColor: AppColors.primaryDark },
  bookNowBtnText: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.white },
});
