import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router } from 'expo-router';
import {
  Bell,
  ChevronDown,
  Hammer,
  MapPin,
  Paintbrush,
  Plug,
  Scissors,
  Search,
  ShieldCheck,
  Shirt,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type Category = {
  id: string;
  label: string;
  Icon: typeof Wrench;
};

const categories: Category[] = [
  { id: 'repair', label: 'Repair', Icon: Wrench },
  { id: 'cleaning', label: 'Cleaning', Icon: Sparkles },
  { id: 'electrical', label: 'Electrical', Icon: Plug },
  { id: 'plumbing', label: 'Plumbing', Icon: Hammer },
  { id: 'painting', label: 'Painting', Icon: Paintbrush },
  { id: 'salon', label: 'Salon', Icon: Scissors },
  { id: 'laundry', label: 'Laundry', Icon: Shirt },
  { id: 'power', label: 'Power Backup', Icon: Zap },
];

const banners = [
  { id: 'b1', tag: 'New user offer', title: 'Flat 20% off', subtitle: 'On your first booking' },
  { id: 'b2', tag: 'This weekend', title: 'Deep cleaning', subtitle: 'Starting at ₹499' },
  { id: 'b3', tag: 'Trending', title: 'AC service', subtitle: 'Beat the summer heat' },
];

const mostBooked = [
  { id: 'm1', name: 'Bathroom Cleaning', price: '₹349', rating: '4.8', bookings: '12k booked', Icon: Sparkles },
  { id: 'm2', name: 'Switchboard Repair', price: '₹199', rating: '4.7', bookings: '8.2k booked', Icon: Plug },
  { id: 'm3', name: 'Wall Painting', price: '₹1,499', rating: '4.9', bookings: '5.4k booked', Icon: Paintbrush },
];

export default function HomeScreenV2() {
  const { width } = useWindowDimensions();
  const bannerWidth = width - 40;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [bannerIndex, setBannerIndex] = useState(0);

  const onBannerScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
    setBannerIndex(index);
  };

  const goToSearch = () => router.push('/services');
  const goToCategory = (categoryId: string) => router.push({ pathname: '/services', params: { category: categoryId } });

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top bar: location + bell */}
        <View style={styles.topBar}>
          <Pressable accessibilityRole='button' style={styles.locationPill} hitSlop={6}>
            <MapPin size={16} color={AppColors.primary} strokeWidth={2} />
            <View>
              <Text style={styles.locationLabel}>Deliver to</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                Home · Indiranagar
              </Text>
            </View>
            <ChevronDown size={16} color={AppColors.textTertiary} strokeWidth={2} />
          </Pressable>

          <Pressable
            accessibilityRole='button'
            style={({ pressed }) => [styles.bellButton, pressed && styles.bellButtonPressed]}
            hitSlop={8}
          >
            <Bell size={19} color={AppColors.textPrimary} strokeWidth={2} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {/* Search */}
        <Pressable
          accessibilityRole='button'
          onPress={goToSearch}
          style={({ pressed }) => [styles.searchBar, pressed && styles.searchBarPressed]}
        >
          <Search size={18} color={AppColors.textTertiary} strokeWidth={2} />
          <Text style={styles.searchPlaceholder}>Try "AC repair" or "Salon at home"</Text>
        </Pressable>

        {/* Banner carousel */}
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={bannerWidth + 12}
          decelerationRate='fast'
          onMomentumScrollEnd={onBannerScrollEnd}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}
          style={styles.bannerScroll}
          contentContainerStyle={styles.bannerContent}
        >
          {banners.map((banner) => (
            <View key={banner.id} style={[styles.bannerCard, { width: bannerWidth }]}>
              <View style={styles.bannerDecor} />
              <View style={styles.bannerTag}>
                <Text style={styles.bannerTagText}>{banner.tag}</Text>
              </View>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.bannerPagination}>
          {banners.map((banner, index) => (
            <View key={banner.id} style={[styles.bannerDot, bannerIndex === index && styles.bannerDotActive]} />
          ))}
        </View>

        {/* Categories grid */}
        <Text style={styles.sectionTitle}>What are you looking for?</Text>

        <View style={styles.categoryGrid}>
          {categories.map((category) => {
            const Icon = category.Icon;
            return (
              <Pressable
                key={category.id}
                accessibilityRole='button'
                onPress={() => goToCategory(category.id)}
                style={({ pressed }) => [styles.categoryItem, pressed && styles.categoryItemPressed]}
              >
                <View style={styles.categoryIconWrap}>
                  <Icon size={22} color={AppColors.primary} strokeWidth={1.75} />
                </View>
                <Text style={styles.categoryLabel} numberOfLines={1}>
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Most booked services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Most Booked Services</Text>
          <Pressable accessibilityRole='button' onPress={goToSearch} hitSlop={8}>
            <Text style={styles.sectionAction}>See all</Text>
          </Pressable>
        </View>

        {mostBooked.map((service) => {
          const Icon = service.Icon;
          return (
            <Pressable
              key={service.id}
              accessibilityRole='button'
              onPress={goToSearch}
              style={({ pressed }) => [styles.serviceRow, pressed && styles.serviceRowPressed]}
            >
              <View style={styles.serviceIconWrap}>
                <Icon size={22} color={AppColors.primary} strokeWidth={1.75} />
              </View>

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <View style={styles.serviceMetaRow}>
                  <Star size={11} color={AppColors.primary} strokeWidth={2} fill={AppColors.primary} />
                  <Text style={styles.serviceRating}>{service.rating}</Text>
                  <Text style={styles.serviceDot}>·</Text>
                  <Text style={styles.serviceBookings}>{service.bookings}</Text>
                </View>
              </View>

              <Text style={styles.servicePrice}>{service.price}</Text>
            </Pressable>
          );
        })}

        {/* Trust strip */}
        <View style={styles.trustStrip}>
          <ShieldCheck size={16} color={AppColors.primary} strokeWidth={2} />
          <Text style={styles.trustStripText}>All professionals are background-verified for your safety</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  locationLabel: {
    fontFamily: font.regular,
    fontSize: 11,
    color: AppColors.textSecondary,
  },
  locationValue: {
    marginTop: 1,
    fontFamily: font.semiBold,
    fontSize: 14,
    color: AppColors.textPrimary,
    maxWidth: 160,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.divider,
  },
  bellButtonPressed: {
    backgroundColor: AppColors.warningLight,
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
    borderWidth: 1.5,
    borderColor: AppColors.white,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    marginBottom: 20,
  },
  searchBarPressed: {
    borderColor: AppColors.primary,
  },
  searchPlaceholder: {
    fontFamily: font.regular,
    fontSize: 13,
    color: AppColors.textTertiary,
    flexShrink: 1,
  },

  // Banner
  bannerScroll: {
    marginHorizontal: -20,
  },
  bannerContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  bannerCard: {
    height: 140,
    borderRadius: 22,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    overflow: 'hidden',
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  bannerDecor: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: -60,
    right: -40,
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
  bannerTagText: {
    fontFamily: font.semiBold,
    fontSize: 10,
    color: AppColors.primary,
  },
  bannerTitle: {
    fontFamily: font.bold,
    fontSize: 20,
    color: AppColors.white,
  },
  bannerSubtitle: {
    marginTop: 4,
    fontFamily: font.regular,
    fontSize: 12,
    color: AppColors.white,
    opacity: 0.85,
  },
  bannerPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 24,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AppColors.divider,
  },
  bannerDotActive: {
    width: 18,
    backgroundColor: AppColors.primary,
  },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: font.semiBold,
    fontSize: 16,
    color: AppColors.textPrimary,
    marginBottom: 14,
  },
  sectionAction: {
    fontFamily: font.medium,
    fontSize: 13,
    color: AppColors.primary,
  },

  // Category grid (4 columns)
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
    marginBottom: 28,
  },
  categoryItem: {
    width: '25%',
    alignItems: 'center',
  },
  categoryItemPressed: {
    opacity: 0.75,
  },
  categoryIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
    marginBottom: 8,
  },
  categoryLabel: {
    fontFamily: font.medium,
    fontSize: 11,
    color: AppColors.textSecondary,
    textAlign: 'center',
    maxWidth: 68,
  },

  // Most booked service rows
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    marginBottom: 10,
  },
  serviceRowPressed: {
    backgroundColor: AppColors.warningLight,
    borderColor: AppColors.warningLight,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontFamily: font.semiBold,
    fontSize: 13,
    color: AppColors.textPrimary,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  serviceRating: {
    fontFamily: font.semiBold,
    fontSize: 11,
    color: AppColors.textPrimary,
  },
  serviceDot: {
    fontSize: 11,
    color: AppColors.textTertiary,
  },
  serviceBookings: {
    fontFamily: font.regular,
    fontSize: 11,
    color: AppColors.textSecondary,
  },
  servicePrice: {
    fontFamily: font.semiBold,
    fontSize: 13,
    color: AppColors.textPrimary,
  },

  // Trust strip
  trustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: AppColors.warningLight,
  },
  trustStripText: {
    flex: 1,
    fontFamily: font.regular,
    fontSize: 12,
    lineHeight: 17,
    color: AppColors.textSecondary,
  },
});
