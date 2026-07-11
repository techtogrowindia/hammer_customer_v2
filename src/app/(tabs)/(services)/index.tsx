import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronRight,
  Hammer,
  Paintbrush,
  Plug,
  Scissors,
  Search,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  Sparkles,
  Star,
  Wrench,
  X,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type IconType = typeof Wrench;

function RingIcon({ Icon, size = 56, iconSize = 22 }: { Icon: IconType; size?: number; iconSize?: number }) {
  return (
    <View style={[styles.ringOuter, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.ringInner, { width: size * 0.83, height: size * 0.83, borderRadius: (size * 0.83) / 2 }]}>
        <Icon size={iconSize} color={AppColors.primary} strokeWidth={1.75} />
      </View>
    </View>
  );
}

type Category = { id: string; label: string; Icon: IconType };
type Service = {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: string;
  reviews: string;
  duration: string;
  Icon: IconType;
};

const categories: Category[] = [
  { id: 'all', label: 'All', Icon: Sparkles },
  { id: 'cleaning', label: 'Cleaning', Icon: Sparkles },
  { id: 'electrical', label: 'Electrical', Icon: Plug },
  { id: 'plumbing', label: 'Plumbing', Icon: Hammer },
  { id: 'repair', label: 'Repair', Icon: Wrench },
  { id: 'painting', label: 'Painting', Icon: Paintbrush },
  { id: 'salon', label: 'Salon', Icon: Scissors },
  { id: 'laundry', label: 'Laundry', Icon: Shirt },
  { id: 'power', label: 'Power', Icon: Zap },
];

const services: Service[] = [
  {
    id: 's1',
    name: 'Bathroom Cleaning',
    category: 'cleaning',
    price: '₹349',
    rating: '4.8',
    reviews: '2.1k',
    duration: '2 hrs',
    Icon: Sparkles,
  },
  {
    id: 's2',
    name: 'Kitchen Deep Clean',
    category: 'cleaning',
    price: '₹499',
    rating: '4.7',
    reviews: '1.4k',
    duration: '3 hrs',
    Icon: Sparkles,
  },
  {
    id: 's3',
    name: 'Switchboard Repair',
    category: 'electrical',
    price: '₹199',
    rating: '4.7',
    reviews: '980',
    duration: '1 hr',
    Icon: Plug,
  },
  {
    id: 's4',
    name: 'Fan Installation',
    category: 'electrical',
    price: '₹149',
    rating: '4.9',
    reviews: '3.2k',
    duration: '30 min',
    Icon: Plug,
  },
  {
    id: 's5',
    name: 'Pipe Leak Fix',
    category: 'plumbing',
    price: '₹299',
    rating: '4.6',
    reviews: '740',
    duration: '1 hr',
    Icon: Hammer,
  },
  {
    id: 's6',
    name: 'Full Home Painting',
    category: 'painting',
    price: '₹1,499',
    rating: '4.9',
    reviews: '560',
    duration: '1–2 days',
    Icon: Paintbrush,
  },
  {
    id: 's7',
    name: 'Appliance Repair',
    category: 'repair',
    price: '₹249',
    rating: '4.5',
    reviews: '1.2k',
    duration: '1 hr',
    Icon: Wrench,
  },
  {
    id: 's8',
    name: 'Haircut at Home',
    category: 'salon',
    price: '₹299',
    rating: '4.8',
    reviews: '3.8k',
    duration: '45 min',
    Icon: Scissors,
  },
  {
    id: 's9',
    name: 'Laundry Pickup',
    category: 'laundry',
    price: '₹99',
    rating: '4.6',
    reviews: '890',
    duration: '24 hrs',
    Icon: Shirt,
  },
  {
    id: 's10',
    name: 'Generator Repair',
    category: 'power',
    price: '₹399',
    rating: '4.5',
    reviews: '310',
    duration: '2 hrs',
    Icon: Zap,
  },
];

export default function ServicesScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const initialCategory = params.category ?? 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [query, setQuery] = useState('');

  const filteredServices = services.filter((s) => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesQuery = query.trim() === '' || s.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const goToService = (serviceId: string) => {
    router.push({ pathname: '/services/[id]', params: { id: serviceId } } as never);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <View style={styles.headerBar}>
        <Text style={styles.screenTitle}>Services</Text>
        <Pressable
          accessibilityRole='button'
          style={({ pressed }) => [styles.filterButton, pressed && styles.filterButtonPressed]}
          hitSlop={8}
        >
          <SlidersHorizontal size={18} color={AppColors.textPrimary} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Search size={17} color={AppColors.textTertiary} strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Search services'
            placeholderTextColor={AppColors.textTertiary}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <X size={16} color={AppColors.textTertiary} strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}
      >
        {categories.map((cat) => {
          const active = activeCategory === cat.id;
          const Icon = cat.Icon;
          return (
            <Pressable
              key={cat.id}
              accessibilityRole='button'
              onPress={() => setActiveCategory(cat.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Icon size={14} color={active ? AppColors.white : AppColors.textSecondary} strokeWidth={2} />
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{cat.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Results count */}
        <Text style={styles.resultsLabel}>
          {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
        </Text>

        {/* Service cards */}
        {filteredServices.length === 0 ? (
          <View style={styles.emptyState}>
            <RingIcon Icon={Search} size={72} iconSize={26} />
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptySubtitle}>Try a different search or category</Text>
          </View>
        ) : (
          filteredServices.map((service) => (
            <Pressable
              key={service.id}
              accessibilityRole='button'
              onPress={() => goToService(service.id)}
              style={({ pressed }) => [styles.serviceCard, pressed && styles.serviceCardPressed]}
            >
              <RingIcon Icon={service.Icon} size={56} iconSize={22} />

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>

                <View style={styles.serviceMetaRow}>
                  <Star size={11} color={AppColors.primary} strokeWidth={2} fill={AppColors.primary} />
                  <Text style={styles.serviceRating}>{service.rating}</Text>
                  <Text style={styles.serviceDot}>·</Text>
                  <Text style={styles.serviceReviews}>{service.reviews} reviews</Text>
                  <Text style={styles.serviceDot}>·</Text>
                  <Text style={styles.serviceDuration}>{service.duration}</Text>
                </View>

                <View style={styles.serviceFooter}>
                  <Text style={styles.servicePrice}>From {service.price}</Text>

                  <Pressable
                    accessibilityRole='button'
                    onPress={() => goToService(service.id)}
                    style={({ pressed }) => [styles.bookButton, pressed && styles.bookButtonPressed]}
                  >
                    <Text style={styles.bookButtonText}>Book</Text>
                  </Pressable>
                </View>
              </View>

              <ChevronRight size={16} color={AppColors.textTertiary} strokeWidth={2} />
            </Pressable>
          ))
        )}

        {/* Bottom trust strip */}
        <View style={styles.trustStrip}>
          <ShieldCheck size={15} color={AppColors.primary} strokeWidth={2} />
          <Text style={styles.trustStripText}>All professionals are background-verified for your safety</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.white },

  // Ring icon — same as home & profile
  ringOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
    flexShrink: 0,
  },
  ringInner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  screenTitle: { fontFamily: font.bold, fontSize: 24, color: AppColors.textPrimary },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.divider,
  },
  filterButtonPressed: { backgroundColor: AppColors.warningLight },

  searchWrap: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4 },
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
  },
  searchInput: {
    flex: 1,
    fontFamily: font.medium,
    fontSize: 14,
    color: AppColors.textPrimary,
  },

  // Category chips
  chipScroll: { flexGrow: 0 },
  chipRow: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    backgroundColor: AppColors.white,
  },
  chipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  chipLabel: { fontFamily: font.medium, fontSize: 12, color: AppColors.textSecondary },
  chipLabelActive: { color: AppColors.white },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 32 },

  resultsLabel: {
    marginBottom: 12,
    fontFamily: font.regular,
    fontSize: 12,
    color: AppColors.textTertiary,
  },

  // Service card
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    marginBottom: 12,
  },
  serviceCardPressed: { backgroundColor: AppColors.warningLight, borderColor: AppColors.warningLight },
  serviceInfo: { flex: 1 },
  serviceName: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.textPrimary },
  serviceMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  serviceRating: { fontFamily: font.semiBold, fontSize: 11, color: AppColors.textPrimary },
  serviceDot: { fontSize: 11, color: AppColors.textTertiary },
  serviceReviews: { fontFamily: font.regular, fontSize: 11, color: AppColors.textSecondary },
  serviceDuration: { fontFamily: font.regular, fontSize: 11, color: AppColors.textSecondary },
  serviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  servicePrice: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  bookButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  bookButtonPressed: { backgroundColor: AppColors.primaryDark },
  bookButtonText: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.white },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 56 },
  emptyTitle: { marginTop: 16, fontFamily: font.bold, fontSize: 18, color: AppColors.textPrimary },
  emptySubtitle: { marginTop: 8, fontFamily: font.regular, fontSize: 13, color: AppColors.textSecondary },

  // Trust strip
  trustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: AppColors.warningLight,
  },
  trustStripText: { flex: 1, fontFamily: font.regular, fontSize: 12, lineHeight: 17, color: AppColors.textSecondary },
});
