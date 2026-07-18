import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { OrderCard, OrderCardData, OrderStatus } from '@/components/order/order-card';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router } from 'expo-router';
import { PackageSearch } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const FILTERS: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const orders: OrderCardData[] = [
  {
    id: 'o1',
    title: 'Bathroom Deep Cleaning',
    date: 'Jul 14, 2026',
    time: '10:30 AM',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop',
  },
  {
    id: 'o2',
    title: 'Fan Installation',
    date: 'Jul 16, 2026',
    time: '2:00 PM',
    status: 'ongoing',
    imageUrl: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=200&h=200&fit=crop',
  },
  {
    id: 'o3',
    title: 'Full Home Painting',
    date: 'Jul 18, 2026',
    time: '9:00 AM',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&h=200&fit=crop',
  },
  {
    id: 'o4',
    title: 'Switchboard Repair',
    date: 'Jul 10, 2026',
    time: '4:15 PM',
    status: 'cancelled',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop',
  },
  {
    id: 'o5',
    title: 'Haircut at Home',
    date: 'Jul 5, 2026',
    time: '11:00 AM',
    status: 'completed',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop',
  },
];

export default function OrderHistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');
  const { top } = useSafeAreaInsets();

  const viewOrder = (orderId: string) => {
    router.push({ pathname: '/(tabs)/(orders)/order-details', params: { id: orderId } } as never);
  };

  const visibleOrders = useMemo(
    () => orders.filter((o) => activeFilter === 'all' || o.status === activeFilter),
    [activeFilter],
  );

  return (
    <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}
      >
        {FILTERS.map((f) => {
          const active = activeFilter === f.id;
          return (
            <Pressable
              key={f.id}
              accessibilityRole='button'
              onPress={() => setActiveFilter(f.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {visibleOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <CircleIcon Icon={PackageSearch} size={72} iconSize={26} />
          <Text style={styles.emptyTitle}>No orders found</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === 'all' ? 'Your bookings will show up here' : `No ${activeFilter} orders yet`}
          </Text>
        </View>
      ) : (
        visibleOrders.map((order) => <OrderCard key={order.id} order={order} onViewOrder={viewOrder} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerBar: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontFamily: font.bold, fontSize: 22, color: AppColors.textPrimary },

  body: { paddingHorizontal: 20, paddingBottom: 32, flex: 1, backgroundColor: AppColors.background },

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

  emptyState: { alignItems: 'center', paddingVertical: 56 },
  emptyTitle: { marginTop: 16, fontFamily: font.bold, fontSize: 18, color: AppColors.textPrimary },
  emptySubtitle: {
    marginTop: 8,
    fontFamily: font.regular,
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
});
