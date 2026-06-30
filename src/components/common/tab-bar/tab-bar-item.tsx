import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { Circle } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { TabIcons } from './tab-bar-icons';
import { TabBarItemProps } from './tab-bar.types';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TabBarItem({ icon, label, focused, badge, onPress }: TabBarItemProps) {
  const Icon = TabIcons[icon] ?? Circle;

  const scale = useSharedValue(focused ? 1 : 0.95);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.95, {
      damping: 14,
      stiffness: 180,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const showBadge = typeof badge === 'number' && badge > 0;

  return (
    <AnimatedPressable
      accessibilityRole='button'
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      style={[styles.container, animatedStyle]}
      onPress={onPress}
    >
      <Animated.View style={[styles.iconBadge, focused && styles.iconBadgeActive]}>
        <Icon size={22} strokeWidth={2} color={focused ? AppColors.primary : AppColors.textSecondary} />

        {showBadge && (
          <Animated.View style={styles.badge}>
            <Text style={styles.badgeText}>{badge! > 99 ? '99+' : badge}</Text>
          </Animated.View>
        )}
      </Animated.View>

      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconBadgeActive: {
    backgroundColor: AppColors.warningLight,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    fontFamily: font.medium,
    fontSize: 11,
    color: AppColors.textSecondary,
  },
  labelActive: {
    fontFamily: font.semiBold,
    color: AppColors.primary,
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF4D4F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: AppColors.white,
  },
  badgeText: {
    color: AppColors.white,
    fontSize: 10,
    fontFamily: font.medium,
  },
});
