import React, { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

type AppKeyboardHandlerProps = PropsWithChildren<{
  keyboardVerticalOffset?: number;
}>;

export function AppKeyboardHandler({ children, keyboardVerticalOffset = 0 }: AppKeyboardHandlerProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.container}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
