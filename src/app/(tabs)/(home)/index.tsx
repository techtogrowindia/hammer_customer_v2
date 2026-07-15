import { CalloutBanner } from '@/components/home/banner-promo/call-out';
import { InfoStrip } from '@/components/home/banner-promo/info-strip';
import { PromoStrip } from '@/components/home/banner-promo/promo-strip';
import { BannerCarousel } from '@/components/home/carousel/banner-carousel';
import { CategoryScroller } from '@/components/home/category/category-scroller';
import { SectionHeader } from '@/components/home/header/section-header';
import { BannerItem, BookAgainItem, CategoryItem, HowItWorksStep, ServiceItem } from '@/components/home/home.types';
import { StepRow } from '@/components/home/how-it-works/how-it-works';
import { BookAgainList } from '@/components/home/services/book-again';
import { ServiceGrid } from '@/components/home/services/service-grid';
import { AppColors } from '@/core/theme/app-colors';
import { useBoundStore } from '@/store/boundStore';
import { router } from 'expo-router';
import {
  CalendarCheck2,
  Clock,
  Crown,
  Gift,
  Hammer,
  Paintbrush,
  Plug,
  Scissors,
  ShieldCheck,
  Shirt,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';

const categories: CategoryItem[] = [
  { id: 'cleaning', label: 'Cleaning', Icon: Sparkles },
  { id: 'electrical', label: 'Electrical', Icon: Plug },
  { id: 'plumbing', label: 'Plumbing', Icon: Hammer },
  { id: 'repair', label: 'Repair', Icon: Wrench },
  { id: 'painting', label: 'Painting', Icon: Paintbrush },
  { id: 'salon', label: 'Salon', Icon: Scissors },
  { id: 'laundry', label: 'Laundry', Icon: Shirt },
  { id: 'power', label: 'Power', Icon: Zap },
];

const banners: BannerItem[] = [
  { id: 'b1', tag: 'New user offer', title: 'Flat 20% off', subtitle: 'On your first booking' },
  { id: 'b2', tag: 'This weekend', title: 'Deep cleaning', subtitle: 'Starting at ₹499' },
  { id: 'b3', tag: 'Trending', title: 'AC service', subtitle: 'Beat the summer heat' },
];

const bookAgain: BookAgainItem[] = [
  { id: 'a1', name: 'Bathroom Cleaning', lastDate: 'Booked 14 May', Icon: Sparkles },
  { id: 'a2', name: 'AC Service', lastDate: 'Booked 02 May', Icon: Zap },
  { id: 'a3', name: 'Electrician Visit', lastDate: 'Booked 18 Apr', Icon: Plug },
];

const mostBooked: ServiceItem[] = [
  { id: 'm1', name: 'Bathroom Cleaning', price: '₹349', rating: '4.8', bookings: '12k booked', Icon: Sparkles },
  { id: 'm2', name: 'Switchboard Repair', price: '₹199', rating: '4.7', bookings: '8.2k booked', Icon: Plug },
  { id: 'm3', name: 'Wall Painting', price: '₹1,499', rating: '4.9', bookings: '5.4k booked', Icon: Paintbrush },
];

const howItWorks: HowItWorksStep[] = [
  { id: 'h1', label: 'Book a service', Icon: CalendarCheck2 },
  { id: 'h2', label: 'Pro arrives on time', Icon: Clock },
  { id: 'h3', label: 'Sit back & relax', Icon: ShieldCheck },
];

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();

  const { userInfo } = useBoundStore(
    useShallow((state) => ({
      userInfo: state.userInfo,
    })),
  );

  const goToSearch = () => router.push('/services');
  const goToCategory = (id: string) => router.push({ pathname: '/services', params: { category: id } } as never);
  const goToOrders = () => router.push('/orders');

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.body}>
        <PromoStrip
          Icon={Crown}
          title='Unlock Membership'
          subtitle='Priority booking + free cancellations'
          style={{ marginBottom: 20 }}
        />

        <BannerCarousel banners={banners} />

        <SectionHeader title='What are you looking for?' />
        <CategoryScroller categories={categories} onSelect={goToCategory} />

        <BookAgainList items={bookAgain} onSeeAll={goToOrders} onRebook={goToSearch} />

        <ServiceGrid services={mostBooked} onSelect={goToSearch} onSeeAll={goToSearch} />

        <StepRow steps={howItWorks} />

        <CalloutBanner Icon={Gift} title='Refer & Earn ₹150' subtitle='Invite friends, get rewards instantly' />

        <InfoStrip text='All professionals are background-verified for your safety' />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
});
