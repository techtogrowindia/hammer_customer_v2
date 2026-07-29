import { LEGAL_LINKS, LegalDocType } from '@/core/constants/legal';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { WebView } from '@expo/dom-webview';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const INJECTED_LOAD_SIGNAL = `
window.addEventListener('load', function () {
  window.ReactNativeWebView.postMessage('loaded');
});
true;
`;

export default function LegalDocumentScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const doc = LEGAL_LINKS[type as LegalDocType];
  const [isLoading, setIsLoading] = useState(true);

  if (!doc) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>This document isn&apos;t available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: doc.url }}
        style={styles.webview}
        injectedJavaScriptBeforeContentLoaded={INJECTED_LOAD_SIGNAL}
        onMessage={() => setIsLoading(false)}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color={AppColors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.white },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: {
    fontFamily: fontTokens.fontFamily.medium,
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
});
