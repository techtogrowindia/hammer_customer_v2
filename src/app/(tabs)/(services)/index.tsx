import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { InfoStrip } from '@/components/home/banner-promo/info-strip';
import { SectionHeader } from '@/components/home/header/section-header';
import { ServiceCard, ServiceCardData } from '@/components/service/card/service-card';
import { ServicesHero } from '@/components/service/header/service-header';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { Hammer, Paintbrush, Plug, Scissors, Search, Shirt, Sparkles, Wrench, Zap } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type IconType = typeof Wrench;
type Category = { id: string; label: string; Icon: IconType };

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

const services: (ServiceCardData & { category: string })[] = [
  {
    id: 's1',
    name: 'Bathroom Cleaning',
    category: 'cleaning',
    price: '₹349',
    originalPrice: '₹430',
    discountPercent: 19,
    rating: '4.8',
    reviews: '2.1k',
    duration: '2 hrs',
    tag: 'bestseller',
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
    originalPrice: '₹199',
    discountPercent: 25,
    rating: '4.9',
    reviews: '3.2k',
    duration: '30 min',
    tag: 'trending',
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
    tag: 'bestseller',
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
    originalPrice: '₹350',
    discountPercent: 15,
    rating: '4.8',
    reviews: '3.8k',
    duration: '45 min',
    tag: 'new',
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
  const { top } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string }>();
  const initialCategory = params.category ?? 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredServices = useMemo(
    () => services.filter((s) => activeCategory === 'all' || s.category === activeCategory),
    [activeCategory],
  );

  const goToService = (serviceId: string) => {
    router.push({ pathname: '/service/[id]', params: { id: serviceId } } as never);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <StatusBar barStyle='light-content' backgroundColor={AppColors.primary} translucent={false} />

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        <ServicesHero
          topInset={top}
          title='Services'
          addressLabel='Home · Indiranagar'
          addressDetail='123, 1st Main Road, Chennai, Tamilnadu 660038'
          onChangeAddressPress={() => router.push('/profile/addresses' as never)}
          onNotificationPress={() => router.push('/notifications' as never)}
          hasUnreadNotification
        />

        <View style={styles.body}>
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

          <SectionHeader
            title={`${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''} available`}
          />

          {/* Service cards */}
          {filteredServices.length === 0 ? (
            <View style={styles.emptyState}>
              <CircleIcon Icon={Search} size={72} iconSize={26} />
              <Text style={styles.emptyTitle}>No services found</Text>
              <Text style={styles.emptySubtitle}>Try a different category</Text>
            </View>
          ) : (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={goToService}
                isFavorite={favorites.has(service.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          )}

          <InfoStrip text='All professionals are background-verified for your safety' />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.white },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  chipScroll: { flexGrow: 0 },
  chipRow: { paddingVertical: 4, marginBottom: 20, gap: 8 },
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
  chipActive: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  chipLabel: { fontFamily: font.medium, fontSize: 12, color: AppColors.textSecondary },
  chipLabelActive: { color: AppColors.white },

  emptyState: { alignItems: 'center', paddingVertical: 56 },
  emptyTitle: { marginTop: 16, fontFamily: font.bold, fontSize: 18, color: AppColors.textPrimary },
  emptySubtitle: { marginTop: 8, fontFamily: font.regular, fontSize: 13, color: AppColors.textSecondary },
});
