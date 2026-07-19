import { DestructiveButton } from '@/components/common/button/destructive-button';
import { CalloutBanner } from '@/components/home/banner-promo/call-out';
import { MenuGroup } from '@/components/profile/menu/menu-group';
import { MenuItem, MenuSectionData, StatItem } from '@/components/profile/profile.types';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useBoundStore } from '@/store/boundStore';
import { router } from 'expo-router';
import {
  Bell,
  FileText,
  Gift,
  Heart,
  HelpCircle,
  MapPin,
  Settings,
  ShieldCheck,
  Star,
  Ticket,
} from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

// ── Sample content — in a real app this would come from an API/store ──
const stats: StatItem[] = [
  { label: 'Bookings', value: '12' },
  { label: 'Reviews', value: '8' },
  { label: 'Saved ₹', value: '860' },
];

const sections: MenuSectionData[] = [
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'bookings',
        label: 'My Bookings',
        subtitle: 'Track & manage your services',
        Icon: Ticket,
        route: '/(tabs)/(orders)',
      },
      {
        id: 'addresses',
        label: 'My Addresses',
        subtitle: 'Manage saved locations',
        Icon: MapPin,
        route: '/(tabs)/(profile)/address/select-address',
      },
      {
        id: 'favorites',
        label: 'Favorites',
        subtitle: 'Your saved professionals',
        Icon: Heart,
        route: '/profile/favorites',
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    items: [
      {
        id: 'notifications',
        label: 'Notifications',
        subtitle: 'Reminders & updates',
        Icon: Bell,
        route: '/(tabs)/(profile)/notification',
      },
      { id: 'settings', label: 'Settings', subtitle: 'App preferences', Icon: Settings, route: '/profile/settings' },
    ],
  },
  {
    id: 'rewards',
    title: 'Rewards',
    items: [
      { id: 'refer', label: 'Refer & Earn', subtitle: 'Invite friends, get ₹150', Icon: Gift, route: '/profile/refer' },
      { id: 'rate', label: 'Rate the App', subtitle: 'Tell us what you think', Icon: Star, route: '/profile/rate' },
    ],
  },
  {
    id: 'support',
    title: 'Support & Legal',
    items: [
      { id: 'help', label: 'Help Center', subtitle: 'FAQs & live support', Icon: HelpCircle, route: '/profile/help' },
      { id: 'privacy', label: 'Privacy Policy', Icon: ShieldCheck, route: '/profile/privacy' },
      { id: 'terms', label: 'Terms & Conditions', Icon: FileText, route: '/profile/terms' },
    ],
  },
];

export default function ProfileScreen() {
  const clearUserInfo = useBoundStore(useShallow((state) => state.clearUserInfo));
  const handleMenuPress = (item: MenuItem) => {
    if (item.route) router.push(item.route as never);
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          clearUserInfo();
          router.dismissAll();
          router.replace('/(auth)/otp/generate-otp');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.body}>
        {/* <StatsRow stats={stats} /> */}

        <CalloutBanner Icon={Gift} title='Refer & Earn ₹150' subtitle='Invite friends, get rewards instantly' />

        {sections.map((section) => (
          <MenuGroup key={section.id} section={section} onItemPress={handleMenuPress} />
        ))}

        <DestructiveButton label='Log Out' onPress={handleLogout} />

        <Text style={styles.versionText}>App version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36 },
  versionText: {
    marginTop: 20,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 11,
    color: AppColors.textTertiary,
    textAlign: 'center',
  },
});
