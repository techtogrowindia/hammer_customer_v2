import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform } from 'react-native';

export type ServiceTiming = 'immediate' | 'later';
export type PickerMode = 'date' | 'time' | null;

export function useSchedule() {
  const [timing, setTiming] = useState<ServiceTiming>('immediate');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);

  const selectTiming = (next: ServiceTiming) => {
    setTiming(next);
    if (next === 'immediate') {
      setScheduledDate(null);
      setPickerMode(null);
    }
  };

  const openDatePicker = () => setPickerMode('date');
  const openTimePicker = () => setPickerMode('time');

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    const mode = pickerMode;
    if (Platform.OS === 'android') setPickerMode(null);

    if (event.type === 'dismissed' || !selected) {
      if (Platform.OS !== 'android') setPickerMode(null);
      return;
    }

    setScheduledDate((prev) => {
      const base = prev ?? new Date();
      const next = new Date(base);
      if (mode === 'date') {
        next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      } else {
        next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      }
      return next;
    });

    if (Platform.OS !== 'android') setPickerMode(null);
  };

  return { timing, scheduledDate, pickerMode, selectTiming, openDatePicker, openTimePicker, onPickerChange };
}
