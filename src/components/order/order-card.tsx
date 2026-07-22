import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { GPDData } from '@/domain/models/orders/place-order-response';
import { useBoundStore } from '@/store/boundStore';
import { ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

interface OrderCardProps {
  order: GPDData;
  onViewOrder: (id: number) => void;
}

export function OrderCard({ order, onViewOrder }: OrderCardProps) {
  const { categoryList } = useBoundStore(
    useShallow((state) => ({
      categoryList: state.categoryList,
    })),
  );
  const serviceId = Number(order?.service?.id);

  const subCategory = categoryList
    .flatMap((category) => category.subcategories ?? [])
    .find((sub) => sub.services?.some((service) => service.id === serviceId));

  console.log(subCategory);

  const [imageFailed, setImageFailed] = useState(false);
  const statusConfig = (() => {
    console.log('order.status', order.status);
    switch (order.status) {
      case 'completed':
        return { label: 'Completed', color: AppColors.success };
      case 'ongoing':
        return { label: 'Ongoing', color: AppColors.primaryDark };
      case 'pending':
      case 'pending_technician':
        return { label: 'Pending', color: AppColors.warning };
      case 'cancelled':
        return { label: 'Cancelled', color: AppColors.error };
      default:
        return { label: 'Unknown', color: AppColors.textSecondary };
    }
  })();
  return (
    <View style={styles.card}>
      {subCategory?.image && !imageFailed ? (
        <Image
          source={{ uri: subCategory.image }}
          style={styles.image}
          resizeMode='cover'
          onError={() => setImageFailed(true)}
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]}>
          <Text style={styles.imageFallbackText}>{order?.order_id?.toString().charAt(0)}</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {subCategory?.name || 'Service Name Unavailable'}
        </Text>
        <Text style={styles.datetime} numberOfLines={1}>
          {order?.created_at
            ? new Date(order.created_at).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : ''}
        </Text>

        <Pressable
          accessibilityRole='button'
          onPress={() => onViewOrder(order?.order_id ?? 0)}
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
