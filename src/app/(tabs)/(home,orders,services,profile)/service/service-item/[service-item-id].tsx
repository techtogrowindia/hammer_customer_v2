import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { InfoStrip } from '@/components/home/banner-promo/info-strip';
import { ServiceCard, ServiceCardData } from '@/components/service/card/service-card';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { Hammer, Paintbrush, Plug, Scissors, Search, Shirt, Sparkles, Wrench, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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

export default function ServiceItemScreen() {
  const params = useLocalSearchParams<{ category?: string }>();

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const goToService = (serviceId: string) => {
    router.push({ pathname: '/service/service-details/12', params: { id: serviceId } } as never);
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.body}>
        {/* <SectionHeader
          title={`${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''} available`}
        /> */}

        {/* Service cards — 2-up grid */}
        {services.length === 0 ? (
          <View style={styles.emptyState}>
            <CircleIcon Icon={Search} size={72} iconSize={26} />
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptySubtitle}>Try a different category</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={goToService}
                isFavorite={favorites.has(service.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </View>
        )}

        <InfoStrip text='All professionals are background-verified for your safety' />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  chipScroll: { flexGrow: 0, marginBottom: 16 },
  chipRow: { gap: 8, paddingRight: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
  },
  chipActive: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  chipLabel: { fontFamily: font.medium, fontSize: 12.5, color: AppColors.textSecondary },
  chipLabelActive: { fontFamily: font.semiBold, color: AppColors.white },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 24,
  },

  emptyState: { alignItems: 'center', paddingVertical: 56 },
  emptyTitle: { marginTop: 16, fontFamily: font.bold, fontSize: 18, color: AppColors.textPrimary },
  emptySubtitle: { marginTop: 8, fontFamily: font.regular, fontSize: 13, color: AppColors.textSecondary },
});
