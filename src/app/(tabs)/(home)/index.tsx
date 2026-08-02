import { CalloutBanner } from '@/components/home/banner-promo/call-out';
import { InfoStrip } from '@/components/home/banner-promo/info-strip';
import { PromoStrip } from '@/components/home/banner-promo/promo-strip';
import { BannerCarousel } from '@/components/home/carousel/banner-carousel';
import { CategoryScroller } from '@/components/home/category/category-scroller';
import { SectionHeader } from '@/components/home/header/section-header';
import { BannerItem, BookAgainItem, HowItWorksStep, ServiceItem } from '@/components/home/home.types';
import { StepRow } from '@/components/home/how-it-works/how-it-works';
import { BookAgainList } from '@/components/home/services/book-again';
import { ServiceGrid } from '@/components/home/services/service-grid';
import { AppColors } from '@/core/theme/app-colors';
import { GCSubCategory } from '@/domain/models/service-categories/getCategoriesResponse';
import { useBoundStore } from '@/store/boundStore';
import { router } from 'expo-router';
import { CalendarCheck2, Clock, Crown, Gift, Paintbrush, Plug, ShieldCheck, Sparkles, Zap } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';
import { useSliderImages } from '@/hooks/useSliderImages';


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
  const { data: apiBanners } = useSliderImages();

  // Straight from Manage → App Banners. No fallback copy: an invented "Flat 20%
  // off" is a promise nobody agreed to honour.
  const banners: BannerItem[] = useMemo(
    () =>
      apiBanners.map((b) => ({
        id: String(b.id),
        tag: b.tag ?? '',
        title: b.title ?? '',
        subtitle: b.subtitle ?? '',
        image: b.image ?? undefined,
      })),
    [apiBanners],
  );

  const { top } = useSafeAreaInsets();

  const { categoryList } = useBoundStore(
    useShallow((state) => ({
      categoryList: state.categoryList,
    })),
  );

  const goToItemDetails = () => router.push('/(tabs)/(home)/service/service-details/12');
  const handleSelectSubcategory = (sub: GCSubCategory) => {
    router.push({
      pathname: '/service/service-item/[service-item-id]',
      params: {
        'service-item-id': String(sub.id),
        title: sub?.name,
      },
    });
  };

  const goToOrders = () => router.push('/(tabs)/(orders)');

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.body}>
        <PromoStrip
          Icon={Crown}
          title='Unlock Membership'
          subtitle='Priority booking + free cancellations'
          style={{ marginBottom: 20 }}
        />

        {banners.length > 0 && <BannerCarousel banners={banners} />}

        <SectionHeader
          title='What are you looking for?'
          actionLabel='See all'
          onActionPress={() => router.push('/(tabs)/(services)')}
        />
        <CategoryScroller categories={categoryList.slice(0, 6) ?? []} onSelect={handleSelectSubcategory} />

        <BookAgainList items={bookAgain} onSeeAll={goToOrders} onRebook={goToOrders} />

        <ServiceGrid services={mostBooked} onSelect={goToOrders} onSeeAll={goToOrders} />

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
  // body: { paddingHorizontal: 20, paddingTop: 0, paddingBottom: 32 },
});
