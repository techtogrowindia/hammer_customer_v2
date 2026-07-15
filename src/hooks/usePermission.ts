import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';

export interface PermissionResult {
  granted: boolean;
  canAskAgain: boolean;
}

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
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

  const getNotificationPermission = useCallback(async (): Promise<PermissionResult> => {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();

    return {
      granted: status === 'granted',
      canAskAgain,
    };
  }, []);

  const getLocationPermission = useCallback(async (): Promise<PermissionResult> => {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

    return {
      granted: status === 'granted',
      canAskAgain,
    };
  }, []);

  /**
   * Returns current latitude & longitude
   */
  const getCurrentLocation = useCallback(async (): Promise<CurrentLocation> => {
    const permission = await requestLocationPermission();

    if (!permission.granted) {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      altitude: location.coords.altitude,
      heading: location.coords.heading,
      speed: location.coords.speed,
      timestamp: location.timestamp,
    };
  }, [requestLocationPermission]);

  /**
   * Returns current location with address
   */
  const getCurrentAddress = useCallback(async () => {
    const permission = await requestLocationPermission();

    if (!permission.granted) {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const addresses = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: addresses[0] ?? null,
    };
  }, [requestLocationPermission]);

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

    getCurrentLocation,
    getCurrentAddress,

    openSettings,
  };
}
