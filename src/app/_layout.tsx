import WithAppShell from '@/components/app-shell/withAppShell';
import { GlobalKeyboardAvoidView } from '@/components/common/keyboard/global-keyboard-avoid-view';
import AppLoader from '@/components/common/loader/app-loader';
import { WithSplashScreen } from '@/components/splash/withSplashScreen';
import { useBoundStore } from '@/store/boundStore';
import { Stack } from 'expo-router';
import { useShallow } from 'zustand/shallow';

export default function RootLayout() {
  const { showAppLoader } = useBoundStore(
    useShallow((state) => ({
      showAppLoader: state.showAppLoader,
    })),
  );
  return (
    <WithSplashScreen>
      <WithAppShell>
        <GlobalKeyboardAvoidView>
          <Stack screenOptions={{ headerShown: false }} />
        </GlobalKeyboardAvoidView>
        <AppLoader visible={showAppLoader} />
      </WithAppShell>
    </WithSplashScreen>
  );
}
