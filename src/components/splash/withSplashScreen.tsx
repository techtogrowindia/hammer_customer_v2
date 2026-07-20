import { AppColors } from '@/core/theme/app-colors';
import { useAddressApisHelper } from '@/hooks/useAddressApisHelper';
import { useOrderApisHelper } from '@/hooks/useOrdersApisHelper';
import { usePermissions } from '@/hooks/usePermission';
import { useSCApisHelper } from '@/hooks/useSCApisHelper';
import { useBoundStore } from '@/store/boundStore';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useShallow } from 'zustand/shallow';
import LottieLoader from '../common/lottie/LottieLoader';

SplashScreen.preventAutoHideAsync().catch(() => {});

const SPLASH_DELAY = 3000;

type Props = {
  children: ReactNode;
};

export function WithSplashScreen({ children }: Props) {
  const [showApp, setShowApp] = useState(false);

  const { getAddresses } = useAddressApisHelper();
  const { getCurrentLocation } = usePermissions();
  const { getServiceCategories } = useSCApisHelper();
  const { listOrders } = useOrderApisHelper();
  const { isLoggedIn } = useBoundStore(
    useShallow((state) => ({
      isLoggedIn: state.isLoggedIn,
    })),
  );
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    let mounted = true;

    const prepare = async () => {
      try {
        // const locationDetails = getCurrentLocation();

        // console.log('Location details:', locationDetails);

        if (isLoggedIn) {
          await Promise.all([getAddresses(), getServiceCategories(), listOrders()]);
        }
      } catch (error) {
        console.error('App initialization failed:', error);
      } finally {
        await SplashScreen.hideAsync();

        if (mounted) {
          setShowApp(true);
        }
      }
    };

    prepare();

    return () => {
      mounted = false;
    };
  }, [fontsLoaded, isLoggedIn]);
  if (!showApp) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: AppColors.white,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LottieLoader
          source={require('../../../assets/lotties/repair-icon.json')}
          width={220}
          height={220}
          autoPlay
          loop
        />
      </View>
    );
  }

  return <>{children}</>;
}
