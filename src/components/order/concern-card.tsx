import { AppColors } from '@/core/theme/app-colors';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { AlertTriangle, CheckCircle2, Mic, Pause, Play, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { genTicketId } from './constants';
import { styles } from './styles';
import { ConcernType } from './types';

export function RaiseConcernCard({ isProductOrder, daysLeft }: { isProductOrder: boolean; daysLeft: number }) {
  const [activeType, setActiveType] = useState<ConcernType | null>(null);
  const [description, setDescription] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);

  // Compact single-clip voice note, mirroring the pattern used on the
  // booking screen's voice note recorder.
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder, 200);
  const [clip, setClip] = useState<{ uri: string } | null>(null);
  const player = useAudioPlayer(clip?.uri ?? null);
  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
  }, []);

  if (daysLeft <= 0) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <AlertTriangle size={15} color={AppColors.textTertiary} strokeWidth={2.25} />
          <Text style={styles.sectionLabel}>Need help with this order?</Text>
        </View>
        <Text style={styles.emptyText}>The 7-day window to raise a concern for this order has closed.</Text>
      </View>
    );
  }

  if (ticketId) {
    return (
      <View style={styles.card}>
        <View style={styles.reviewSubmittedRow}>
          <CheckCircle2 size={18} color={AppColors.success} strokeWidth={2.25} />
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewSubmittedText}>Concern raised · {ticketId}</Text>
            <Text style={styles.helperText}>
              Your technician and our support team have been notified and will get back to you shortly.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const startRecording = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      Alert.alert('Permission needed', 'Allow microphone access to record a voice note.');
      return;
    }
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    if (audioRecorder.uri) setClip({ uri: audioRecorder.uri });
  };

  const togglePlayback = () => {
    if (!clip) return;
    if (playerStatus.playing) {
      player.pause();
    } else {
      if (playerStatus.didJustFinish) player.seekTo(0);
      player.play();
    }
  };

  const submit = () => {
    if (!activeType || description.trim().length === 0) return;
    setTicketId(genTicketId());
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <AlertTriangle size={15} color={AppColors.primary} strokeWidth={2.25} />
        <Text style={styles.sectionLabel}>Need help with this order?</Text>
      </View>
      <Text style={styles.helperText}>
        You can raise a concern within {daysLeft} day{daysLeft === 1 ? '' : 's'}.
      </Text>

      <View style={styles.concernTypeRow}>
        <Pressable
          accessibilityRole='button'
          onPress={() => setActiveType('service')}
          style={[styles.concernTypeChip, activeType === 'service' && styles.concernTypeChipSelected]}
        >
          <Text style={[styles.concernTypeText, activeType === 'service' && styles.concernTypeTextSelected]}>
            Concern with service
          </Text>
        </Pressable>
        {isProductOrder && (
          <Pressable
            accessibilityRole='button'
            onPress={() => setActiveType('product')}
            style={[styles.concernTypeChip, activeType === 'product' && styles.concernTypeChipSelected]}
          >
            <Text style={[styles.concernTypeText, activeType === 'product' && styles.concernTypeTextSelected]}>
              Concern with product
            </Text>
          </Pressable>
        )}
      </View>

      {activeType && (
        <>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder='Describe the issue...'
            placeholderTextColor={AppColors.textTertiary}
            multiline
            numberOfLines={3}
            style={[styles.textArea, { marginTop: 12 }]}
          />

          <View style={styles.voiceRow}>
            <Pressable
              accessibilityRole='button'
              onPress={recorderState.isRecording ? stopRecording : startRecording}
              style={({ pressed }) => [
                styles.recordBtn,
                recorderState.isRecording && styles.recordBtnActive,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Mic size={13} color={AppColors.white} strokeWidth={2.25} />
              <Text style={styles.recordBtnText}>{recorderState.isRecording ? 'Stop' : 'Add voice note'}</Text>
            </Pressable>

            {clip && !recorderState.isRecording && (
              <View style={styles.clipRow}>
                <Pressable accessibilityRole='button' onPress={togglePlayback} hitSlop={6}>
                  {playerStatus.playing ? (
                    <Pause size={14} color={AppColors.textPrimary} strokeWidth={2.25} />
                  ) : (
                    <Play size={14} color={AppColors.textPrimary} strokeWidth={2.25} />
                  )}
                </Pressable>
                <Text style={styles.clipLabel}>Voice note attached</Text>
                <Pressable accessibilityRole='button' onPress={() => setClip(null)} hitSlop={6}>
                  <Trash2 size={13} color={AppColors.error} strokeWidth={2} />
                </Pressable>
              </View>
            )}
          </View>

          <Pressable
            accessibilityRole='button'
            disabled={description.trim().length === 0}
            onPress={submit}
            style={({ pressed }) => [
              styles.reviewSubmitBtn,
              description.trim().length === 0 && { opacity: 0.5 },
              pressed && description.trim().length > 0 && { backgroundColor: AppColors.primaryDark },
            ]}
          >
            <Text style={styles.reviewSubmitBtnText}>Raise concern</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
