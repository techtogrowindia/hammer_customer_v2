import TabBar from '@/components/common/tab-bar/tab-bar';
import { Tabs } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  initialRouteName: '(home)',
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        lazy: true,
        freezeOnBlur: true,
      }}
    >
      <Tabs.Screen
        name='(home)'
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name='services'
        options={{
          title: 'Services',
        }}
      />

      <Tabs.Screen
        name='orders'
        options={{
          title: 'Orders',
        }}
      />

      <Tabs.Screen
        name='(profile)'
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
