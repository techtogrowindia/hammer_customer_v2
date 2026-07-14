import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { Alert, StatusBar } from 'react-native';

import { AppColors } from '@/core/theme/app-colors';
import { usePermissions } from '@/hooks/usePermission';
import { PermissionPrompt } from './permisson-prompt';

const benefits = [
  'Get notified when your professional is on the way',
  'Reminders before scheduled bookings',
  'Exclusive offers and discount alerts',
];

export default function NotificationPermissionScreen() {
  const { requestNotificationPermission, openSettings } = usePermissions();

  const handleAllow = async () => {
    const result = await requestNotificationPermission();

    if (!result.granted && !result.canAskAgain) {
      Alert.alert(
        'Notifications Disabled',
        'Notification permission has been permanently denied. You can enable it from your device settings.',
        [
          {
            text: 'Not Now',
            style: 'cancel',
            onPress: () => router.replace('/(auth)/otp/generate-otp'),
          },
          {
            text: 'Open Settings',
            onPress: async () => {
              await openSettings();
              router.replace('/(auth)/otp/generate-otp');
            },
          },
        ],
      );

      return;
    }

    router.replace('/(auth)/otp/generate-otp');
  };

  const handleSkip = () => {
    router.replace('/(auth)/otp/generate-otp');
  };

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <PermissionPrompt
        Icon={Bell}
        title='Stay in the loop'
        description='Turn on notifications so you never miss an update about your bookings.'
        benefits={benefits}
        primaryLabel='Allow Notifications'
        onAllow={handleAllow}
        onSkip={handleSkip}
      />
    </>
  );
}
