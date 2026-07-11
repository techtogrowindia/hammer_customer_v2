import { IconType } from '@/components/home/home.types';
import { AppColors } from '@/core/theme/app-colors';
import { LogOut } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface DestructiveButtonProps {
  label: string;
  onPress?: () => void;
  Icon?: IconType;
  color?: string;
}

export function DestructiveButton({ label, onPress, Icon = LogOut, color = '#E5484D' }: DestructiveButtonProps) {
  return (
    <Pressable
      accessibilityRole='button'
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && { backgroundColor: AppColors.warningLight }]}
    >
      <Icon size={18} color={color} strokeWidth={2} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    marginTop: 4,
  },
  text: { fontFamily: 'Poppins_600SemiBold', fontSize: 14 },
});

export default DestructiveButton;
