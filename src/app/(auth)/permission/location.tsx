import { AppColors } from '@/core/theme/app-colors';
import { router } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import { StatusBar } from 'react-native';
import { PermissionPrompt } from './permisson-prompt';

const benefits = [
  'Find professionals available near you',
  'Faster checkout with auto-filled address',
  'Accurate service time estimates for your area',
];

export default function LocationPermissionScreen() {
  const requestPermission = async () => {
    // Triggers the native OS location permission dialog.
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // Unlike notifications, location genuinely affects core functionality
    // (finding nearby pros, address autofill) — you may want to route a
    // denial to a different screen than a grant (e.g. straight to manual
    // address entry) rather than always continuing to the same place.
    router.replace('/' as never);
  };

  const skip = () => {
    router.replace('/' as never);
  };

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />
      <PermissionPrompt
        Icon={MapPin}
        title='Enable your location'
        description='We use your location to show services and professionals available in your area.'
        benefits={benefits}
        primaryLabel='Allow Location Access'
        onAllow={requestPermission}
        onSkip={skip}
      />
    </>
  );
}
