import { AppColors } from '@/core/theme/app-colors';
import { Calendar } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../../app/(tabs)/(home,orders,services,profile)/booking/[booking-id]';

export function BookingFooter({ onPress }: { onPress: () => void }) {
  return (
    <SafeAreaView edges={['bottom']} style={[styles.footer, { paddingBottom: 12 }]}>
      <Pressable
        accessibilityRole='button'
        onPress={onPress}
        style={({ pressed }) => [styles.bookBtn, pressed && styles.bookBtnPressed]}
      >
        <Calendar size={16} color={AppColors.white} strokeWidth={2.25} />
        <Text style={styles.bookBtnText}>Book service</Text>
      </Pressable>
    </SafeAreaView>
  );
}
