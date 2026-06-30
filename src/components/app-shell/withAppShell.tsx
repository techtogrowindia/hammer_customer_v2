import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const WithAppShell = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={[]} style={{ flex: 1 }}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default WithAppShell;

const styles = StyleSheet.create({});
