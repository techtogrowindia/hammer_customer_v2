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
import LottieLoader from '../common/lottie/LottieLoader';

SplashScreen.preventAutoHideAsync().catch(() => {});

const SPLASH_DELAY = 3000;

type Props = {
  children: ReactNode;
};

export function WithSplashScreen({ children }: Props) {
  const [showApp, setShowApp] = useState(false);

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
  }, [fontsLoaded]);

  if (!showApp) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFB500',
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
