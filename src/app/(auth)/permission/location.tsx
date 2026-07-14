import { AppColors } from '@/core/theme/app-colors';
import { usePermissions } from '@/hooks/usePermission';
import { router } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import { Alert, StatusBar } from 'react-native';
import { PermissionPrompt } from './permisson-prompt';

const benefits = [
  'Find professionals available near you',
  'Faster checkout with auto-filled address',
  'Accurate service time estimates for your area',
];

export default function LocationPermissionScreen() {
  const { requestLocationPermission, openSettings } = usePermissions();

  const handleAllow = async () => {
    const result = await requestLocationPermission();

    if (!result.granted && !result.canAskAgain) {
      Alert.alert(
        'Location Permission Required',
        'Location access has been permanently denied. You can enable it from your device settings.',
        [
          {
            text: 'Not Now',
            style: 'cancel',
            onPress: () => router.replace('/'),
          },
          {
            text: 'Open Settings',
            onPress: async () => {
              await openSettings();
              router.replace('/');
            },
          },
        ],
      );

      return;
    }

    router.replace('/');
  };

  const handleSkip = () => {
    router.replace('/');
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
        onAllow={handleAllow}
        // onSkip={handleSkip}
      />
    </>
  );
}
