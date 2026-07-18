import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

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
  imageUrl?: string;
}

interface OrderCardProps {
  order: OrderCardData;
  onViewOrder: (id: string) => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  completed: { label: 'Completed', color: AppColors.success },
  ongoing: { label: 'Ongoing', color: AppColors.primaryDark },
  pending: { label: 'Pending', color: AppColors.textSecondary },
  cancelled: { label: 'Cancelled', color: AppColors.error },
};

/**
 * Three-column row: image | title/date/view-more | status. Status sits in
 * its own fixed-width column, vertically centered against the full card
 * height (not tied to the title line or the image), so it reads as an
 * independent piece of information rather than a label stuck onto
 * something else.
 */
export function OrderCard({ order, onViewOrder }: OrderCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <View style={styles.card}>
      {order.imageUrl && !imageFailed ? (
        <Image
          source={{ uri: order.imageUrl }}
          style={styles.image}
          resizeMode='cover'
          onError={() => setImageFailed(true)}
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]}>
          <Text style={styles.imageFallbackText}>{order.title.charAt(0)}</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {order.title}
        </Text>
        <Text style={styles.datetime} numberOfLines={1}>
          {order.date} · {order.time}
        </Text>

        <Pressable
          accessibilityRole='button'
          onPress={() => onViewOrder(order.id)}
          style={({ pressed }) => [styles.viewMoreBtn, pressed && styles.viewMoreBtnPressed]}
        >
          <Text style={styles.viewMoreText}>View more</Text>
          <ChevronRight size={13} color={AppColors.primary} strokeWidth={2.5} />
        </Pressable>
      </View>

      <View style={styles.statusCol}>
        <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
        <Text style={[styles.statusText, { color: statusConfig.color }]} numberOfLines={1}>
          {statusConfig.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    padding: 10,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    marginBottom: 12,
  },

  image: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: AppColors.warningLight,
  },
  imageFallback: { alignItems: 'center', justifyContent: 'center' },
  imageFallbackText: { fontFamily: font.semiBold, fontSize: 22, color: AppColors.textTertiary },

  body: { flex: 1, gap: 4 },
  title: { fontFamily: font.semiBold, fontSize: 14.5, color: AppColors.textPrimary },
  datetime: { fontFamily: font.regular, fontSize: 11.5, color: AppColors.textSecondary },

  viewMoreBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
  },
  viewMoreBtnPressed: { opacity: 0.6 },
  viewMoreText: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.primary },

  statusCol: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    width: 56,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontFamily: font.medium, fontSize: 9.5, textAlign: 'center' },
});

export default OrderCard;
