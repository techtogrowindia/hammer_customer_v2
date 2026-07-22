import { AppColors } from '@/core/theme/app-colors';
import { formatDuration } from '@/core/utils/order-helpers';
import { VoiceNote } from '@/hooks/useVoiceRecorder';
import { Mic, Pause, Play, Plus, Trash2, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../../../app/(tabs)/(home,orders,services,profile)/booking/[booking-id]';

interface Props {
  isRecording: boolean;
  recordingDurationMillis: number;
  currentClip: { uri: string; durationSeconds: number } | null;
  isPlaying: boolean;
  currentTime: number;
  voiceNotes: VoiceNote[];
  onToggleRecord: () => void;
  onTogglePlayback: () => void;
  onDiscardClip: () => void;
  onAddVoiceNote: () => void;
  onRemoveVoiceNote: (id: string) => void;
  error?: string | null;
  showValidation: boolean;
}

export function VoiceNoteCard({
  isRecording,
  recordingDurationMillis,
  currentClip,
  isPlaying,
  currentTime,
  voiceNotes,
  onToggleRecord,
  onTogglePlayback,
  onDiscardClip,
  onAddVoiceNote,
  onRemoveVoiceNote,
  error,
  showValidation,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionLabelRow}>
        <Text style={styles.sectionLabel}>Voice note</Text>
        {/* <Text style={styles.requiredMark}>*</Text> */}
      </View>

      <View style={styles.voiceRow}>
        <Pressable
          accessibilityRole='button'
          onPress={onToggleRecord}
          style={({ pressed }) => [
            styles.recordBtn,
            isRecording && styles.recordBtnActive,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Mic size={14} color={AppColors.white} strokeWidth={2.25} />
          <Text style={styles.recordBtnText}>{isRecording ? 'Stop' : 'Record'}</Text>
        </Pressable>
        <Text style={styles.voiceHelperText}>
          {isRecording
            ? `Recording... ${formatDuration(recordingDurationMillis / 1000)}`
            : currentClip
              ? 'Recording saved. You can preview below.'
              : 'Tap Record to capture a short voice note.'}
        </Text>
      </View>

      {currentClip && (
        <View style={styles.previewRow}>
          <Text style={styles.previewLabel}>Preview:</Text>
          <View style={styles.previewPlayer}>
            <Pressable accessibilityRole='button' onPress={onTogglePlayback} style={styles.previewPlayBtn} hitSlop={6}>
              {isPlaying ? (
                <Pause size={14} color={AppColors.textPrimary} strokeWidth={2.25} />
              ) : (
                <Play size={14} color={AppColors.textPrimary} strokeWidth={2.25} />
              )}
            </Pressable>
            <Text style={styles.previewTime}>
              {formatDuration(currentTime)} / {formatDuration(currentClip.durationSeconds)}
            </Text>
            <View style={styles.previewTrack}>
              <View
                style={[
                  styles.previewProgress,
                  {
                    width: `${
                      currentClip.durationSeconds ? Math.min(100, (currentTime / currentClip.durationSeconds) * 100) : 0
                    }%`,
                  },
                ]}
              />
            </View>
            <Pressable accessibilityRole='button' onPress={onDiscardClip} hitSlop={6}>
              <Trash2 size={14} color={AppColors.error} strokeWidth={2} />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole='button'
            onPress={onAddVoiceNote}
            style={({ pressed }) => [styles.addClipBtn, pressed && styles.addClipBtnPressed]}
          >
            <Plus size={15} color={AppColors.white} strokeWidth={2.5} />
            <Text style={styles.addClipBtnText}>Add this voice</Text>
          </Pressable>
        </View>
      )}

      {voiceNotes.length > 0 && (
        <View style={styles.voiceNoteList}>
          {voiceNotes.map((note, index) => (
            <View key={note.id} style={styles.voiceNoteChip}>
              <Mic size={12} color={AppColors.primary} strokeWidth={2.25} />
              <Text style={styles.voiceNoteChipText}>
                Voice note {index + 1} · {formatDuration(note.durationSeconds)}
              </Text>
              <Pressable accessibilityRole='button' hitSlop={6} onPress={() => onRemoveVoiceNote(note.id)}>
                <X size={13} color={AppColors.textTertiary} strokeWidth={2.25} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {showValidation && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
