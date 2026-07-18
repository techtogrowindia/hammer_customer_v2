import { styles } from '@/components/order/styles';
import { AppColors } from '@/core/theme/app-colors';
import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  destructive,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!visible) return null;
  return (
    <View style={styles.modalOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
      <View style={styles.modalCard}>
        <View style={[styles.modalIconWrap, destructive && styles.modalIconWrapDanger]}>
          <AlertTriangle size={22} color={destructive ? AppColors.error : AppColors.primary} strokeWidth={2.25} />
        </View>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <View style={styles.modalActions}>
          <Pressable
            accessibilityRole='button'
            onPress={onCancel}
            style={({ pressed }) => [styles.modalBtnSecondary, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
          </Pressable>
          <Pressable
            accessibilityRole='button'
            onPress={onConfirm}
            style={({ pressed }) => [
              styles.modalBtnPrimary,
              destructive && styles.modalBtnDanger,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.modalBtnPrimaryText}>{confirmLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
