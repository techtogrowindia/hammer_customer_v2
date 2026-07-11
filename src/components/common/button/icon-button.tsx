import { AppColors } from '@/core/theme/app-colors';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type IconButtonProps = {
  Icon: LucideIcon;
  onPress: () => void;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ Icon, onPress, accessibilityLabel, style }: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <Icon size={20} color={AppColors.textPrimary} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.divider,
  },
  pressed: {
    backgroundColor: AppColors.warningLight,
  },
});
