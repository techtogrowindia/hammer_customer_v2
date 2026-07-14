import TabBar from '@/components/common/tab-bar/tab-bar';
import { Tabs, useSegments } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  initialRouteName: '(home)',
};

export default function TabLayout() {
  const segments = useSegments();

  const hideTabBar = segments.includes('service') || segments.includes('booking');

  return (
    <Tabs
      tabBar={(props) => (hideTabBar ? null : <TabBar {...props} />)}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        lazy: true,
        freezeOnBlur: true,
      }}
    >
      <Tabs.Screen name='(home)' options={{ title: 'Home' }} />

      <Tabs.Screen name='services' options={{ title: 'Services' }} />

      <Tabs.Screen name='orders' options={{ title: 'Orders' }} />

      <Tabs.Screen name='(profile)' options={{ title: 'Profile' }} />
    </Tabs>
  );
}
