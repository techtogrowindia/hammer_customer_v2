import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { usePermissions } from '@/hooks/usePermission';
import { useBoundStore } from '@/store/boundStore';

export default function Index() {
  const { hasOnBoardCompleted, isLoggedIn } = useBoundStore(
    useShallow((state) => ({
      hasOnBoardCompleted: state.hasOnBoardCompleted,
      isLoggedIn: state.isLoggedIn,
    })),
  );

  const { getLocationPermission } = usePermissions();

  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      const permission = await getLocationPermission();
      setHasLocationPermission(permission.granted);
    };

    checkPermission();
  }, [getLocationPermission]);

  if (hasLocationPermission === null) {
    return null;
  }

  const redirectTo = isLoggedIn
    ? '/(tabs)/(home)'
    : !hasOnBoardCompleted
      ? '/onboard'
      : // : !hasLocationPermission
        //   ? '/(auth)/permission/location'
        '/otp/generate-otp';

  return <Redirect href={redirectTo} />;
}
