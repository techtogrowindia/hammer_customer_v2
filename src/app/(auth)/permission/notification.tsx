import { AppColors } from '@/core/theme/app-colors';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { StatusBar } from 'react-native';
import { PermissionPrompt } from './permisson-prompt';

const benefits = [
  'Get notified when your professional is on the way',
  'Reminders before scheduled bookings',
  'Exclusive offers and discount alerts',
];

export default function NotificationPermissionScreen() {
  const requestPermission = async () => {
    // Triggers the actual native OS permission dialog — this screen's
    // own "Allow" button is a soft-ask, not the real grant.
    const { status } = await Notifications.requestPermissionsAsync();
    // Proceed regardless of the outcome — a denial here shouldn't block
    // the rest of onboarding, since notifications are a nice-to-have,
    // not a functional requirement for booking services.
    router.replace('/permissions/location' as never);
  };

  const skip = () => {
    router.replace('/permissions/location' as never);
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
        onAllow={requestPermission}
        onSkip={skip}
      />
    </>
  );
}
