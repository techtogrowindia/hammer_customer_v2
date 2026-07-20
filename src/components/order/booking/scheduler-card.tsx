import { AppColors } from '@/core/theme/app-colors';
import { formatDateLabel, formatTimeLabel } from '@/core/utils/order-helpers';
import { PickerMode, ServiceTiming } from '@/hooks/useShedule';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar, Clock } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../../../app/(tabs)/(home,orders,services,profile)/booking/[booking-id]';

interface Props {
  timing: ServiceTiming;
  scheduledDate: Date | null;
  pickerMode: PickerMode;
  onSelectTiming: (t: ServiceTiming) => void;
  onOpenDatePicker: () => void;
  onOpenTimePicker: () => void;
  onPickerChange: (event: DateTimePickerEvent, selected?: Date) => void;
  error?: string | null;
  showValidation: boolean;
}

export function TimingScheduleCard({
  timing,
  scheduledDate,
  pickerMode,
  onSelectTiming,
  onOpenDatePicker,
  onOpenTimePicker,
  onPickerChange,
  error,
  showValidation,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>When do you need the service?</Text>
      <View style={styles.timingRow}>
        <Pressable
          accessibilityRole='button'
          onPress={() => onSelectTiming('immediate')}
          style={styles.timingOption}
          hitSlop={6}
        >
          <View style={[styles.radioOuter, timing === 'immediate' && styles.radioOuterSelected]}>
            {timing === 'immediate' && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.timingLabel}>Immediate</Text>
        </Pressable>
        <Pressable
          accessibilityRole='button'
          onPress={() => onSelectTiming('later')}
          style={styles.timingOption}
          hitSlop={6}
        >
          <View style={[styles.radioOuter, timing === 'later' && styles.radioOuterSelected]}>
            {timing === 'later' && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.timingLabel}>Later</Text>
        </Pressable>
      </View>

      {timing === 'later' && (
        <View style={styles.scheduleRow}>
          <Pressable
            accessibilityRole='button'
            onPress={onOpenDatePicker}
            style={({ pressed }) => [
              styles.scheduleChip,
              Boolean(scheduledDate) && styles.scheduleChipFilled,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Calendar
              size={14}
              color={scheduledDate ? AppColors.primaryDark : AppColors.textTertiary}
              strokeWidth={2}
            />
            <Text style={[styles.scheduleChipText, scheduledDate && styles.scheduleChipTextFilled]}>
              {scheduledDate ? formatDateLabel(scheduledDate) : 'Select date'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole='button'
            onPress={onOpenTimePicker}
            style={({ pressed }) => [
              styles.scheduleChip,
              Boolean(scheduledDate) && styles.scheduleChipFilled,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Clock size={14} color={scheduledDate ? AppColors.primaryDark : AppColors.textTertiary} strokeWidth={2} />
            <Text style={[styles.scheduleChipText, scheduledDate && styles.scheduleChipTextFilled]}>
              {scheduledDate ? formatTimeLabel(scheduledDate) : 'Select time'}
            </Text>
          </Pressable>
        </View>
      )}

      {showValidation && error && <Text style={styles.errorText}>{error}</Text>}

      {pickerMode && (
        <DateTimePicker
          value={scheduledDate ?? new Date()}
          mode={pickerMode}
          minimumDate={new Date()}
          is24Hour={false}
          onChange={onPickerChange}
        />
      )}
    </View>
  );
}
