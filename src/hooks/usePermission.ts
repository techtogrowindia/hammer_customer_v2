import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';

export interface PermissionResult {
  granted: boolean;
  canAskAgain: boolean;
}

export function usePermissions() {
  const requestNotificationPermission = useCallback(async (): Promise<PermissionResult> => {
    if (!Device.isDevice) {
      return {
        granted: false,
        canAskAgain: false,
      };
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const current = await Notifications.getPermissionsAsync();

    let status = current.status;
    let canAskAgain = current.canAskAgain;

    if (status !== 'granted' && canAskAgain) {
      const result = await Notifications.requestPermissionsAsync();
      status = result.status;
      canAskAgain = result.canAskAgain;
    }

    return {
      granted: status === 'granted',
      canAskAgain,
    };
  }, []);

  const requestLocationPermission = useCallback(async (): Promise<PermissionResult> => {
    const current = await Location.getForegroundPermissionsAsync();

    let status = current.status;
    let canAskAgain = current.canAskAgain;

    if (status !== 'granted' && canAskAgain) {
      const result = await Location.requestForegroundPermissionsAsync();
      status = result.status;
      canAskAgain = result.canAskAgain;
    }

    return {
      granted: status === 'granted',
      canAskAgain,
    };
  }, []);

  const getNotificationPermission = useCallback(async () => {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();

    return {
      granted: status === 'granted',
      canAskAgain,
    };
  }, []);

  const getLocationPermission = useCallback(async () => {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

    return {
      granted: status === 'granted',
      canAskAgain,
    };
  }, []);

  const requestAllPermissions = useCallback(async () => {
    const [notification, location] = await Promise.all([requestNotificationPermission(), requestLocationPermission()]);

    return {
      notification,
      location,
    };
  }, [requestNotificationPermission, requestLocationPermission]);

  const openSettings = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  return {
    requestNotificationPermission,
    requestLocationPermission,
    requestAllPermissions,

    getNotificationPermission,
    getLocationPermission,

    openSettings,
  };
}
