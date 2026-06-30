import { AppColors } from '@/core/theme/app-colors';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TabBarItem from './tab-bar-item';

// Keys are normalized (group parens stripped) so '(home)' -> 'home', '(profile)' -> 'profile'
const routeIcons: Record<string, string> = {
  home: 'home',
  services: 'services',
  orders: 'orders',
  profile: 'profile',
};

const routeLabels: Record<string, string> = {
  home: 'Home',
  services: 'Services',
  orders: 'Orders',
  profile: 'Profile',
};

// '(home)' -> 'home', '(profile)' -> 'profile', 'services' -> 'services'
const normalizeRouteName = (name: string) => name.replace(/[()]/g, '');

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(bottom, 14),
        },
      ]}
    >
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const key = normalizeRouteName(route.name);

          const badge = Number(descriptors[route.key].options.tabBarBadge);

          return (
            <TabBarItem
              key={route.key}
              icon={routeIcons[key]}
              label={routeLabels[key]}
              focused={focused}
              badge={badge}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: AppColors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppColors.divider,
  },
  container: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
