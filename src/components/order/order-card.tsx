import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { CheckCircle2, ChevronRight, Clock, Hourglass, XCircle } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

export type OrderStatus = 'completed' | 'pending' | 'ongoing' | 'cancelled';

export interface OrderCardData {
  id: string;
  title: string;
  date: string;
  time: string;
  status: OrderStatus;
}

interface OrderCardProps {
  order: OrderCardData;
  onViewOrder: (id: string) => void;
}

// Tied to the actual theme tokens, same as before, plus an icon per status
// for the circle that now stands in for ProfileHeader's avatar slot.
const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; Icon: typeof Clock }> = {
  completed: { label: 'Completed', bg: AppColors.successLight, text: AppColors.success, Icon: CheckCircle2 },
  ongoing: { label: 'Ongoing', bg: AppColors.warningLight, text: AppColors.primaryDark, Icon: Clock },
  pending: { label: 'Pending', bg: AppColors.shimmer, text: AppColors.textSecondary, Icon: Hourglass },
  cancelled: { label: 'Cancelled', bg: AppColors.errorLight, text: AppColors.error, Icon: XCircle },
};

/**
 * Order row built on the same skeleton as HomeHeader's avatar+greeting row
 * and ProfileHeader's avatar+info card: a circular icon slot on the left
 * (status-colored, standing in for the avatar), title + a badge-row of meta
 * text and a status pill in the middle (mirrors ProfileHeader's
 * mobile-number + verified-badge row), and a trailing circular action
 * button on the right (mirrors ProfileHeader's edit button).
 */
export function OrderCard({ order, onViewOrder }: OrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.Icon;

  return (
    <Pressable
      accessibilityRole='button'
      onPress={() => onViewOrder(order.id)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: statusConfig.bg }]}>
        <StatusIcon size={22} color={statusConfig.text} strokeWidth={2} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {order.title}
        </Text>
        <View style={styles.badgeRow}>
          <Text style={styles.meta} numberOfLines={1}>
            {order.date} · {order.time}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusText, { color: statusConfig.text }]}>{statusConfig.label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.chevronBtn}>
        <ChevronRight size={16} color={AppColors.textTertiary} strokeWidth={2.25} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: AppColors.surface,
    marginBottom: 12,
    // Same language as the header cards (shadowColor/radius/offset) but
    // toned down — that heavier shadow is meant for a single floating card
    // overlapping two background colors; repeated at full strength down a
    // whole list it reads as noisy and costs more to render per row.
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardPressed: { backgroundColor: AppColors.warningLight },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppColors.background,
  },

  info: { flex: 1 },
  title: { fontFamily: font.semiBold, fontSize: 14.5, color: AppColors.textPrimary },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 },
  meta: { flex: 1, fontFamily: font.regular, fontSize: 12, color: AppColors.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontFamily: font.medium, fontSize: 10, letterSpacing: 0.2 },

  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
});

export default OrderCard;
