import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { OrderCard, OrderCardData, OrderStatus } from '@/components/order/order-card';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router } from 'expo-router';
import { PackageSearch } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  bold: fontTokens.fontFamily.bold,
};

type SortOrder = 'newest' | 'oldest';

const FILTERS: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

const orders: OrderCardData[] = [
  { id: 'o1', title: 'Bathroom Deep Cleaning', date: 'Jul 14, 2026', time: '10:30 AM', status: 'completed' },
  { id: 'o2', title: 'Fan Installation', date: 'Jul 16, 2026', time: '2:00 PM', status: 'ongoing' },
  { id: 'o3', title: 'Full Home Painting', date: 'Jul 18, 2026', time: '9:00 AM', status: 'pending' },
  { id: 'o4', title: 'Switchboard Repair', date: 'Jul 10, 2026', time: '4:15 PM', status: 'cancelled' },
  { id: 'o5', title: 'Haircut at Home', date: 'Jul 5, 2026', time: '11:00 AM', status: 'completed' },
];

export default function OrderHistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');

  const viewOrder = (orderId: string) => {
    router.push({ pathname: '/order/[id]', params: { id: orderId } } as never);
  };

  const visibleOrders = useMemo(() => {
    const filtered = orders.filter((o) => activeFilter === 'all' || o.status === activeFilter);

    return filtered;
  }, [activeFilter]);

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.body}>
        <View style={styles.toolbar}>
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
        </View>

        {visibleOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <CircleIcon Icon={PackageSearch} size={72} iconSize={26} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>Try a different filter</Text>
          </View>
        ) : (
          visibleOrders.map((order) => <OrderCard key={order.id} order={order} onViewOrder={viewOrder} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },

  toolbar: { gap: 8, marginBottom: 18 },
  chipScroll: { flexGrow: 0, flex: 1 },
  chipRow: { gap: 8, paddingRight: 8 },
  chip: {
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

  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    backgroundColor: AppColors.white,
  },
  sortBtnText: { fontFamily: font.medium, fontSize: 12, color: AppColors.primary },

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
