import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { SectionHeader } from '@/components/home/header/section-header';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Award, Check, ChevronRight, Clock, Heart, ShieldCheck, Star } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

// TODO: replace with the actual service image (local asset or a prop passed
// in via useLocalSearchParams / a services data lookup keyed by params.id).
const SERVICE_IMAGE_URL = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop';

type Package = {
  id: string;
  label: string;
  price: string;
  originalPrice?: string;
  duration: string;
  description: string;
};

type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
};

const packages: Package[] = [
  {
    id: 'basic',
    label: 'Basic Clean',
    price: '₹349',
    duration: '2 hrs',
    description: 'Sweeping, mopping, dusting & bathroom clean',
  },
  {
    id: 'deep',
    label: 'Deep Clean',
    price: '₹599',
    originalPrice: '₹749',
    duration: '3.5 hrs',
    description: 'Everything in Basic + scrubbing, tile & fixture polish',
  },
];

const includedItems = [
  'Professional carries own equipment',
  'Eco-friendly cleaning products',
  'Trained & background-verified staff',
  '48-hour re-service guarantee',
];

const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Priya S.',
    rating: 5,
    date: '2 days ago',
    comment: 'Very thorough job, bathroom looks brand new. Will book again.',
  },
  {
    id: 'r2',
    name: 'Karthik R.',
    rating: 4,
    date: '1 week ago',
    comment: 'Good service, arrived slightly late but did great work.',
  },
  {
    id: 'r3',
    name: 'Divya M.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Professional and quick. Highly recommend the deep clean package.',
  },
];

const HERO_MAX_HEIGHT = 180;
const HERO_MIN_HEIGHT = 64;
const COLLAPSE_RANGE = HERO_MAX_HEIGHT - HERO_MIN_HEIGHT;

export default function ServiceDetailsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  const [selectedPackage, setSelectedPackage] = useState('deep');
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const activePackage = packages.find((p) => p.id === selectedPackage) ?? packages[0];

  const goToBooking = () => {
    router.push({ pathname: '/booking/12', params: { id: params.id ?? '', package: selectedPackage } } as never);
    // ^ this now correctly matches the booking screen you just built,
    // which reads `package` via useLocalSearchParams to look up price/label
  };

  // Hero shrinks from HERO_MAX_HEIGHT to HERO_MIN_HEIGHT (both plus safe-area
  // inset) over COLLAPSE_RANGE of scroll, then stays pinned at the min height —
  // same idea as a native collapsing large-title nav bar.
  const heroHeight = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE],
    outputRange: [HERO_MAX_HEIGHT + top, HERO_MIN_HEIGHT + top],
    extrapolate: 'clamp',
  });

  // Full-bleed background image fades out across the whole collapse range,
  // so by the time the hero reaches its min height it's a solid color bar
  // (AppColors.primary, set on `hero` itself) rather than a squashed photo.
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_RANGE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Compact title fades in only once the image is mostly gone, so the
  // collapsed header reads as clean solid-color + text.
  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_RANGE * 0.5, COLLAPSE_RANGE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle='light-content' backgroundColor={AppColors.primary} translucent={false} />

      {/* Collapsing hero — sits above the scroll content, animated by scrollY */}
      <Animated.View style={[styles.hero, { height: heroHeight }]}>
        <Animated.Image
          source={{ uri: SERVICE_IMAGE_URL }}
          resizeMode='cover'
          style={[StyleSheet.absoluteFillObject, { opacity: imageOpacity }]}
        />
        {/* Navy tint over the photo so white icons/text stay legible against
            any image, and so the hero reads as on-brand (secondary navy)
            rather than washed out. */}
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

          {/* Compact title — only visible once the hero has mostly collapsed */}
          <Animated.Text style={[styles.compactTitle, { opacity: compactTitleOpacity }]} numberOfLines={1}>
            Bathroom Deep Cleaning
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
          {/* Title block */}
          <View style={styles.titleBlock}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>Cleaning</Text>
            </View>
            <Text style={styles.title}>Bathroom Deep Cleaning</Text>

            <View style={styles.metaRow}>
              <View style={styles.ratingChip}>
                <Star size={11} color={AppColors.white} strokeWidth={2} fill={AppColors.white} />
                <Text style={styles.ratingChipText}>4.8</Text>
              </View>
              <Text style={styles.metaText}>2.1k reviews</Text>
              <Text style={styles.metaDot}>·</Text>
              <Clock size={12} color={AppColors.textTertiary} strokeWidth={2} />
              <Text style={styles.metaText}>{activePackage.duration}</Text>
            </View>
          </View>

          {/* Package selector */}
          <SectionHeader title='Select a package' />
          {packages.map((pkg) => {
            const selected = pkg.id === selectedPackage;
            return (
              <Pressable
                key={pkg.id}
                accessibilityRole='button'
                onPress={() => setSelectedPackage(pkg.id)}
                style={[styles.packageCard, selected && styles.packageCardSelected]}
              >
                <View style={styles.radioOuter}>{selected && <View style={styles.radioInner} />}</View>

                <View style={{ flex: 1 }}>
                  <View style={styles.packageHeaderRow}>
                    <Text style={styles.packageLabel}>{pkg.label}</Text>
                    <View style={styles.packagePriceRow}>
                      <Text style={styles.packagePrice}>{pkg.price}</Text>
                      {pkg.originalPrice && <Text style={styles.packageOriginalPrice}>{pkg.originalPrice}</Text>}
                    </View>
                  </View>
                  <Text style={styles.packageDescription}>{pkg.description}</Text>
                  <Text style={styles.packageDuration}>{pkg.duration}</Text>
                </View>
              </Pressable>
            );
          })}

          {/* What's included */}
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

          {/* Reviews */}
          <SectionHeader title='Customer reviews' actionLabel='See all' onActionPress={() => {}} />
          {reviews.map((review, index) => (
            <View key={review.id} style={[styles.reviewCard, index !== reviews.length - 1 && { marginBottom: 12 }]}>
              <View style={styles.reviewHeader}>
                <CircleIcon Icon={Star} size={36} iconSize={14} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      color={i < review.rating ? AppColors.primary : AppColors.border}
                      fill={i < review.rating ? AppColors.primary : AppColors.border}
                      strokeWidth={0}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Sticky booking bar */}
      <View style={[styles.bookingBar, { paddingBottom: 12 }]}>
        <View>
          <Text style={styles.bookingBarLabel}>{activePackage.label}</Text>
          <View style={styles.bookingBarPriceRow}>
            <Text style={styles.bookingBarPrice}>{activePackage.price}</Text>
            {activePackage.originalPrice && (
              <Text style={styles.bookingBarOriginalPrice}>{activePackage.originalPrice}</Text>
            )}
          </View>
        </View>

        <Pressable
          accessibilityRole='button'
          onPress={goToBooking}
          style={({ pressed }) => [styles.bookNowBtn, pressed && styles.bookNowBtnPressed]}
        >
          <Text style={styles.bookNowBtnText}>Book Now</Text>
          <ChevronRight size={17} color={AppColors.white} strokeWidth={2.25} />
        </Pressable>
      </View>
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
    // Was accidentally `${AppColors.primaryDark}01` (~0.4% opacity, basically
    // invisible) — that left the photo untinted with poor icon/text contrast.
    // A navy (secondary) tint at ~30% both fixes contrast and ties the hero
    // back to the brand's secondary color instead of relying on primary alone.
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
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: AppColors.primary,
  },
  ratingChipText: { fontFamily: font.semiBold, fontSize: 11, color: AppColors.white },
  metaText: { fontFamily: font.regular, fontSize: 12, color: AppColors.textSecondary },
  metaDot: { fontSize: 12, color: AppColors.textTertiary },

  // Package selector — unselected border now uses a neutral (AppColors.border)
  // instead of primaryLight, which read as "half-selected" since it's a
  // saturated brand gold rather than a neutral gray.
  packageCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 10,
  },
  packageCardSelected: { borderColor: AppColors.primary, borderWidth: 1.5, backgroundColor: AppColors.white },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: AppColors.primary },
  packageHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  packageLabel: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.textPrimary },
  packagePriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  packagePrice: { fontFamily: font.bold, fontSize: 15, color: AppColors.textPrimary },
  packageOriginalPrice: {
    fontFamily: font.regular,
    fontSize: 11,
    color: AppColors.textTertiary,
    textDecorationLine: 'line-through',
  },
  packageDescription: { marginTop: 4, fontFamily: font.regular, fontSize: 12, color: AppColors.textSecondary },
  packageDuration: { marginTop: 6, fontFamily: font.medium, fontSize: 11, color: AppColors.textTertiary },

  // Included — was borderColor: divider with no background, which blended
  // into the cream page background (#fff5d6 border on #fff9ee page). Now a
  // real surface card with a neutral border so it visually separates.
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

  // Trust — warningLight (#FFFBEB) was nearly identical to the page
  // background (#fff9ee), so the strip had no visible separation. Now a
  // surface card with a border, same treatment as the cards above it.
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

  // Reviews — same background/border fix as includedCard/trustRow
  reviewCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewName: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.textPrimary },
  reviewDate: { marginTop: 1, fontFamily: font.regular, fontSize: 10.5, color: AppColors.textTertiary },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewComment: {
    marginTop: 10,
    fontFamily: font.regular,
    fontSize: 12.5,
    lineHeight: 18,
    color: AppColors.textSecondary,
  },

  // Sticky booking bar
  bookingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: AppColors.background,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  bookingBarLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  bookingBarPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 2 },
  bookingBarPrice: { fontFamily: font.bold, fontSize: 19, color: AppColors.textPrimary },
  bookingBarOriginalPrice: {
    fontFamily: font.regular,
    fontSize: 12,
    color: AppColors.textTertiary,
    textDecorationLine: 'line-through',
  },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 22,
    paddingVertical: 13,
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
