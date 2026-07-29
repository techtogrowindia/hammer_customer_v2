import Header from '@/components/common/header/header';
import TabBar from '@/components/common/tab-bar/tab-bar';
import { Tabs, useSegments } from 'expo-router';
import React, { useCallback } from 'react';

export const unstable_settings = {
  initialRouteName: '(home)',
};

export default function TabLayout() {
  const segments = useSegments();

  const hideTabBar =
    segments.includes('service') ||
    segments.includes('booking') ||
    segments.includes('address') ||
    segments.includes('edit-profile') ||
    segments.includes('select-address') ||
    segments.includes('add-address') ||
    segments.includes('select-location') ||
    segments.includes('notification') ||
    segments.includes('order-details') ||
    segments.includes('legal');
  const renderHeader = useCallback(() => <Header />, []);

  return (
    <Tabs
      tabBar={(props) => (hideTabBar ? null : <TabBar {...props} />)}
      detachInactiveScreens
      screenOptions={{
        header: renderHeader,
        headerShown: true,
        freezeOnBlur: true,
        animation: 'none',
        lazy: true,
      }}
    >
      <Tabs.Screen name='(home)' options={{ title: 'Home' }} />

      <Tabs.Screen name='(services)' options={{ title: 'Services' }} />

      <Tabs.Screen name='(orders)' options={{ title: 'Orders' }} />

      <Tabs.Screen name='(profile)' options={{ title: 'Profile' }} />
    </Tabs>
  );
}
