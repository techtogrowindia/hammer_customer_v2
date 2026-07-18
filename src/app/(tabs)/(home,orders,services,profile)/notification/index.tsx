import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { router } from 'expo-router';
import { Bell, BellOff, Calendar, CheckCheck, ChevronRight, Gift, Info, Wallet, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type NotificationType = 'booking' | 'payment' | 'offer' | 'system';

type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  group: 'Today' | 'Earlier';
  read: boolean;
  // Where tapping the notification should take the user, if anywhere.
  route?: { pathname: string; params?: Record<string, string> };
};

const TYPE_META: Record<NotificationType, { Icon: typeof Bell; bg: string; color: string }> = {
  booking: { Icon: Calendar, bg: AppColors.warningLight, color: AppColors.primary },
  payment: { Icon: Wallet, bg: '#E6F4EA', color: '#2E9E5B' },
  offer: { Icon: Gift, bg: '#FDE8E8', color: AppColors.error },
  system: { Icon: Info, bg: AppColors.background, color: AppColors.textSecondary },
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Professional is on the way',
    message: 'Your bathroom deep cleaning expert will arrive by 12:15 PM.',
    time: '10 min ago',
    group: 'Today',
    read: false,
    route: { pathname: '/orders/[id]', params: { id: '8834521' } },
  },
  {
    id: 'n2',
    type: 'payment',
    title: 'Payment successful',
    message: 'Payment of ₹649 for booking BK-8834521 was received.',
    time: '1 hr ago',
    group: 'Today',
    read: false,
  },
  {
    id: 'n3',
    type: 'offer',
    title: '20% off your next booking',
    message: 'Use code CLEAN20 on any cleaning service this week.',
    time: '3 hr ago',
    group: 'Today',
    read: true,
  },
  {
    id: 'n4',
    type: 'booking',
    title: 'Booking confirmed',
    message: 'Your AC installation is scheduled for tomorrow, 10 AM – 12 PM.',
    time: 'Yesterday',
    group: 'Earlier',
    read: true,
    route: { pathname: '/orders/[id]', params: { id: '8834110' } },
  },
  {
    id: 'n5',
    type: 'system',
    title: 'New address added',
    message: '"Mom\'s place" was saved to your addresses.',
    time: '2 days ago',
    group: 'Earlier',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const openNotification = (notification: AppNotification) => {
    if (!notification.read) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    }
    if (notification.route) {
      router.push(notification.route as never);
    }
  };

  const groups: AppNotification['group'][] = ['Today', 'Earlier'];

  return (
    <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.scrollContent}>
      {unreadCount > 0 && (
        <Pressable
          accessibilityRole='button'
          onPress={markAllRead}
          style={({ pressed }) => [styles.markAllRow, pressed && { opacity: 0.6 }]}
        >
          <CheckCheck size={14} color={AppColors.primary} strokeWidth={2.25} />
          <Text style={styles.markAllText}>Mark all as read</Text>
        </Pressable>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <BellOff size={28} color={AppColors.textTertiary} strokeWidth={1.75} />
          </View>
          <Text style={styles.emptyTitle}>You're all caught up</Text>
          <Text style={styles.emptySubtitle}>No new notifications right now.</Text>
        </View>
      ) : (
        groups.map((group) => {
          const items = notifications.filter((n) => n.group === group);
          if (items.length === 0) return null;

          return (
            <View key={group} style={styles.groupBlock}>
              <Text style={styles.groupLabel}>{group}</Text>

              {items.map((item) => {
                const meta = TYPE_META[item.type];
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole='button'
                    onPress={() => openNotification(item)}
                    style={({ pressed }) => [
                      styles.card,
                      !item.read && styles.cardUnread,
                      pressed && styles.cardPressed,
                    ]}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
                      <meta.Icon size={17} color={meta.color} strokeWidth={2.25} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.cardTitleRow}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        {!item.read && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.cardMessage} numberOfLines={2}>
                        {item.message}
                      </Text>
                      <Text style={styles.cardTime}>{item.time}</Text>
                    </View>

                    {item.route ? (
                      <ChevronRight size={16} color={AppColors.textTertiary} strokeWidth={2} />
                    ) : (
                      <Pressable
                        accessibilityRole='button'
                        hitSlop={8}
                        onPress={(e) => {
                          e.stopPropagation();
                          dismiss(item.id);
                        }}
                        style={styles.dismissBtn}
                      >
                        <X size={14} color={AppColors.textTertiary} strokeWidth={2.25} />
                      </Pressable>
                    )}
                  </Pressable>
                );
              })}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    flex: 1,
    backgroundColor: AppColors.background,
  },

  markAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 6,
    marginBottom: 14,
    paddingVertical: 4,
  },
  markAllText: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.primary },

  groupBlock: { marginBottom: 8 },
  groupLabel: { marginBottom: 10, fontFamily: font.semiBold, fontSize: 12, color: AppColors.textTertiary },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 10,
  },
  cardUnread: { borderColor: AppColors.primaryLight, backgroundColor: AppColors.warningLight },
  cardPressed: { backgroundColor: AppColors.background },

  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { flex: 1, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  unreadDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: AppColors.primary },
  cardMessage: {
    marginTop: 3,
    fontFamily: font.regular,
    fontSize: 12,
    lineHeight: 17,
    color: AppColors.textSecondary,
  },
  cardTime: { marginTop: 6, fontFamily: font.regular, fontSize: 10.5, color: AppColors.textTertiary },

  dismissBtn: { padding: 2, marginTop: 2 },

  emptyState: { alignItems: 'center', gap: 10, paddingVertical: 80 },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
    marginBottom: 4,
  },
  emptyTitle: { fontFamily: font.semiBold, fontSize: 15, color: AppColors.textPrimary },
  emptySubtitle: { fontFamily: font.regular, fontSize: 12.5, color: AppColors.textSecondary, textAlign: 'center' },
});
