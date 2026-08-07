import { CircleIcon } from '@/components/common/circle-icon/circle-icon';
import { OrderCard } from '@/components/order/order-card';
import { bucketOf, type OrderBucket } from '@/components/order/order-status';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useOrderApisHelper } from '@/hooks/useOrdersApisHelper';
import { useBoundStore } from '@/store/boundStore';
import { router, useFocusEffect } from 'expo-router';
import { PackageSearch } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const FILTERS: { id: OrderBucket | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function OrderHistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<OrderBucket | 'all'>('all');

  const { orderList } = useBoundStore(
    useShallow((state) => ({
      orderList: state.orderList,
    })),
  );

  const { listOrders } = useOrderApisHelper();

  // The store is filled once at launch and after placing an order, so without
  // this the list kept showing the status it had when the app started — a job
  // the technician had since started or finished still read as pending until
  // the app was killed and reopened. Refetch whenever the tab comes into view.
  useFocusEffect(
    useCallback(() => {
      listOrders().catch(() => {
        // The helper already logs; a background refresh must not throw a
        // screen away, and the list keeps showing what it last had.
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // A number, which is what the card passes (`order.order_id`) and what the
  // detail screen reads back with Number(params.id). It was typed as a string.
  const viewOrder = (orderId: number) => {
    router.push({ pathname: '/(tabs)/order-details', params: { id: orderId } } as never);
  };

  // `o.status` is the wire value (`pending_technician`, `technician_assigned`,
  // …) while a chip is a group (`pending`, `ongoing`). Comparing them directly
  // meant Pending and Ongoing matched nothing and showed "No orders found" —
  // Completed and Cancelled only worked because those two words happen to be
  // spelled the same on both sides.
  const visibleOrders = useMemo(
    () => orderList.filter((o) => activeFilter === 'all' || bucketOf(o.status) === activeFilter),
    [activeFilter, orderList],
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
        visibleOrders.map((order) => <OrderCard key={order?.order_id} order={order} onViewOrder={viewOrder} />)
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
