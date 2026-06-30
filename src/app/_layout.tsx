import WithAppShell from '@/components/app-shell/withAppShell';
import { WithSplashScreen } from '@/components/splash/withSplashScreen';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <WithSplashScreen>
      <WithAppShell>
        <Stack screenOptions={{ headerShown: false }} />
      </WithAppShell>
    </WithSplashScreen>
  );
}
