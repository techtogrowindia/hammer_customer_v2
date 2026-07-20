import { genId } from '@/core/utils/order-helpers';
import {
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useState } from 'react';
import { Alert } from 'react-native';

export type VoiceNote = { id: string; uri: string; durationSeconds: number };

export function useVoiceRecorder() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder, 200);
  const [currentClip, setCurrentClip] = useState<{ uri: string; durationSeconds: number } | null>(null);
  const player = useAudioPlayer(currentClip?.uri ?? null);
  const playerStatus = useAudioPlayerStatus(player);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);

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
    if (audioRecorder.uri) {
      setCurrentClip({ uri: audioRecorder.uri, durationSeconds: (recorderState.durationMillis ?? 0) / 1000 });
    }
  };

  const togglePlayback = () => {
    if (!currentClip) return;
    if (playerStatus.playing) {
      player.pause();
    } else {
      if (playerStatus.didJustFinish) player.seekTo(0);
      player.play();
    }
  };

  const discardCurrentClip = () => {
    player.pause();
    setCurrentClip(null);
  };

  const addVoiceNote = () => {
    if (!currentClip) return;
    setVoiceNotes((prev) => [
      ...prev,
      { id: genId(), uri: currentClip.uri, durationSeconds: currentClip.durationSeconds },
    ]);
    discardCurrentClip();
  };

  const removeVoiceNote = (id: string) => setVoiceNotes((prev) => prev.filter((v) => v.id !== id));

  return {
    recorderState,
    currentClip,
    playerStatus,
    voiceNotes,
    startRecording,
    stopRecording,
    togglePlayback,
    discardCurrentClip,
    addVoiceNote,
    removeVoiceNote,
  };
}
