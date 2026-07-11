import { AppKeyboardHandler } from '@/components/common/keyboard/app-keyboard-handler';
import { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ToastivaProvider } from 'toastiva';

const WithAppShell = ({ children }: { children: ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ToastivaProvider position='top-center'>
          <SafeAreaView edges={[]} style={{ flex: 1 }}>
            <AppKeyboardHandler>{children}</AppKeyboardHandler>
          </SafeAreaView>
        </ToastivaProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default WithAppShell;
