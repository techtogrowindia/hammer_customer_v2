import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import LottieLoader from '../common/lottie/LottieLoader';

const { width, height } = Dimensions.get('window');

const SPLASH_DELAY = 4000;

SplashScreen.preventAutoHideAsync().catch(() => {});

type Props = {
  children: ReactNode;
};

export const WithSplashScreen = ({ children }: Props) => {
  const [isReady, setIsReady] = useState(false);

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
        await new Promise((resolve) => setTimeout(resolve, SPLASH_DELAY));

        await SplashScreen.hideAsync();

        if (mounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.warn('Splash initialization failed:', error);

        if (mounted) {
          setIsReady(true);
        }
      }
    };

    prepare();

    return () => {
      mounted = false;
    };
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isReady) {
    return (
      <View
        onLayout={onLayoutRootView}
        style={{
          flex: 1,
          // backgroundColor: '#ED8E24',
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
};
