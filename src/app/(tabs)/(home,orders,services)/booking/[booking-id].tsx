import { CameraCaptureModal } from '@/components/common/camera/camera-capture-modal';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import {
  Calendar,
  Camera,
  ChevronRight,
  Image as ImageIcon,
  MapPin,
  Mic,
  Pause,
  Play,
  Plus,
  Trash2,
  Video as VideoIcon,
  X,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Image as RNImage, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type MediaItem = { id: string; uri: string; type: 'image' | 'video' };
type VoiceNote = { id: string; uri: string; durationSeconds: number };
type ServiceTiming = 'immediate' | 'later';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatDuration = (seconds: number) => {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Real paused-first-frame video thumbnail via expo-video, rather than a
// generic icon placeholder — each grid item gets its own player instance.
function VideoThumb({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.pause();
  });
  return <VideoView player={player} style={styles.mediaThumb} contentFit='cover' nativeControls={false} />;
}

export default function BookingScreen() {
  const { bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  const [issueText, setIssueText] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [cameraVisible, setCameraVisible] = useState(false);

  // Voice note recording — expo-audio hooks
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder, 200);
  const [currentClip, setCurrentClip] = useState<{ uri: string; durationSeconds: number } | null>(null);
  const player = useAudioPlayer(currentClip?.uri ?? null);
  const playerStatus = useAudioPlayerStatus(player);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);

  const [timing, setTiming] = useState<ServiceTiming>('immediate');

  // Single current address, shared with SelectAddressScreen via the store —
  // that screen writes the pick, this screen just reads + displays it.
  // const selectedAddress = useAddressStore((state) => state.selectedAddress);

  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
  }, []);

  // ---- Media (images/videos) ----
  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to attach images or videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const picked: MediaItem[] = result.assets.map((asset) => ({
        id: genId(),
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
      }));
      setMedia((prev) => [...prev, ...picked]);
    }
  };

  const onCameraCapture = (result: { uri: string; type: 'image' | 'video' }) => {
    setMedia((prev) => [...prev, { id: genId(), uri: result.uri, type: result.type }]);
  };

  const removeMedia = (id: string) => setMedia((prev) => prev.filter((m) => m.id !== id));

  // ---- Voice note recording (expo-audio) ----
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

  // ---- Validation + submit ----
  const errors = {
    media: media.length === 0 ? 'Attach at least one image or video' : null,
    voice: voiceNotes.length === 0 ? 'A voice note is required' : null,
  };
  const hasErrors = Boolean(errors.media || errors.voice);

  const bookService = () => {
    if (hasErrors) {
      setShowValidation(true);
      return;
    }
    // TODO: upload media + voice notes, then submit the booking payload
    // (issueText, media, voiceNotes, timing, selectedAddress) to the backend.
    router.push({ pathname: '/booking/confirm-booking' as never, params: { id: params.id ?? '' } as never });
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Book a service</Text>
          <Text style={styles.pageSubtitle}>Add details and we'll connect you with a verified professional.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Explain the issue</Text>
          <TextInput
            value={issueText}
            onChangeText={setIssueText}
            placeholder='e.g. Need to install new AC'
            placeholderTextColor={AppColors.textTertiary}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Images / Videos</Text>
            <Text style={styles.requiredMark}>*</Text>
          </View>
          <Text style={styles.helperText}>At least one; add multiple for a better quote.</Text>

          <View style={styles.mediaBtnRow}>
            <Pressable
              accessibilityRole='button'
              onPress={pickFromLibrary}
              style={({ pressed }) => [styles.uploadBtn, pressed && { backgroundColor: AppColors.warningLight }]}
            >
              <ImageIcon size={16} color={AppColors.primaryDark} strokeWidth={2} />
              <Text style={styles.uploadBtnText}>Choose from library</Text>
            </Pressable>
            <Pressable
              accessibilityRole='button'
              onPress={() => setCameraVisible(true)}
              style={({ pressed }) => [styles.uploadBtn, pressed && { backgroundColor: AppColors.warningLight }]}
            >
              <Camera size={16} color={AppColors.primaryDark} strokeWidth={2} />
              <Text style={styles.uploadBtnText}>Use camera</Text>
            </Pressable>
          </View>
          <Text style={styles.fileHint}>Images: jpeg, png, gif, webp (10MB). Videos: mp4, webm, mov (50MB).</Text>

          {media.length > 0 && (
            <View style={styles.mediaGrid}>
              {media.map((item) => (
                <View key={item.id} style={styles.mediaThumbWrap}>
                  {item.type === 'image' ? (
                    <RNImage source={{ uri: item.uri }} style={styles.mediaThumb} resizeMode='cover' />
                  ) : (
                    <View style={styles.mediaThumb}>
                      <VideoThumb uri={item.uri} />
                      <View style={styles.videoBadge} pointerEvents='none'>
                        <VideoIcon size={12} color={AppColors.white} strokeWidth={2.25} />
                      </View>
                    </View>
                  )}
                  <Pressable
                    accessibilityRole='button'
                    hitSlop={6}
                    onPress={() => removeMedia(item.id)}
                    style={styles.mediaRemoveBtn}
                  >
                    <X size={12} color={AppColors.white} strokeWidth={3} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {showValidation && errors.media && <Text style={styles.errorText}>{errors.media}</Text>}
        </View>

        <View style={styles.card}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Voice note</Text>
            <Text style={styles.requiredBadge}>*</Text>
          </View>

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
              <Mic size={14} color={AppColors.white} strokeWidth={2.25} />
              <Text style={styles.recordBtnText}>{recorderState.isRecording ? 'Stop' : 'Record'}</Text>
            </Pressable>
            <Text style={styles.voiceHelperText}>
              {recorderState.isRecording
                ? `Recording... ${formatDuration((recorderState.durationMillis ?? 0) / 1000)}`
                : currentClip
                  ? 'Recording saved. You can preview below.'
                  : 'Tap Record to capture a short voice note.'}
            </Text>
          </View>

          {currentClip && (
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Preview:</Text>
              <View style={styles.previewPlayer}>
                <Pressable
                  accessibilityRole='button'
                  onPress={togglePlayback}
                  style={styles.previewPlayBtn}
                  hitSlop={6}
                >
                  {playerStatus.playing ? (
                    <Pause size={14} color={AppColors.textPrimary} strokeWidth={2.25} />
                  ) : (
                    <Play size={14} color={AppColors.textPrimary} strokeWidth={2.25} />
                  )}
                </Pressable>
                <Text style={styles.previewTime}>
                  {formatDuration(playerStatus.currentTime ?? 0)} / {formatDuration(currentClip.durationSeconds)}
                </Text>
                <View style={styles.previewTrack}>
                  <View
                    style={[
                      styles.previewProgress,
                      {
                        width: `${
                          currentClip.durationSeconds
                            ? Math.min(100, ((playerStatus.currentTime ?? 0) / currentClip.durationSeconds) * 100)
                            : 0
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Pressable accessibilityRole='button' onPress={discardCurrentClip} hitSlop={6}>
                  <Trash2 size={14} color={AppColors.error} strokeWidth={2} />
                </Pressable>
              </View>

              <Pressable
                accessibilityRole='button'
                onPress={addVoiceNote}
                style={({ pressed }) => [styles.addClipBtn, pressed && styles.addClipBtnPressed]}
              >
                <Plus size={15} color={AppColors.white} strokeWidth={2.5} />
                <Text style={styles.addClipBtnText}>Add</Text>
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
                  <Pressable accessibilityRole='button' hitSlop={6} onPress={() => removeVoiceNote(note.id)}>
                    <X size={13} color={AppColors.textTertiary} strokeWidth={2.25} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {showValidation && errors.voice && <Text style={styles.errorText}>{errors.voice}</Text>}
        </View>

        <Text style={styles.sectionLabel}>When do you need the service?</Text>
        <View style={styles.timingRow}>
          <Pressable
            accessibilityRole='button'
            onPress={() => setTiming('immediate')}
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
            onPress={() => setTiming('later')}
            style={styles.timingOption}
            hitSlop={6}
          >
            <View style={[styles.radioOuter, timing === 'later' && styles.radioOuterSelected]}>
              {timing === 'later' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.timingLabel}>Later</Text>
          </Pressable>
        </View>

        {/* Service address — shows the current default/selected address only;
            picking a different one happens on its own screen rather than
            duplicating a full address list + manual entry form here. */}
        <Text style={styles.sectionLabel}>Service address</Text>
        <Pressable
          accessibilityRole='button'
          onPress={() => router.push('/address/select-address' as never)}
          style={({ pressed }) => [styles.addressCard, pressed && styles.addressCardPressed]}
        >
          <View style={styles.addressIconWrap}>
            <MapPin size={17} color={AppColors.primary} strokeWidth={2.25} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addressLabel} numberOfLines={1}>
              {'Home - India'}
            </Text>
            <Text style={styles.addressDetail} numberOfLines={1}>
              {'203 0303'}
              {/* {[selectedAddress.line2, selectedAddress.city, selectedAddress.pincode].filter(Boolean).join(', ')} */}
            </Text>
          </View>
          <View style={styles.changeRow}>
            <Text style={styles.changeText}>Change</Text>
            <ChevronRight size={16} color={AppColors.textTertiary} strokeWidth={2} />
          </View>
        </Pressable>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={[styles.footer, { paddingBottom: 12 }]}>
        <Pressable
          accessibilityRole='button'
          onPress={bookService}
          style={({ pressed }) => [styles.bookBtn, pressed && styles.bookBtnPressed]}
        >
          <Calendar size={16} color={AppColors.white} strokeWidth={2.25} />
          <Text style={styles.bookBtnText}>Book service</Text>
        </Pressable>
      </SafeAreaView>

      <CameraCaptureModal visible={cameraVisible} onClose={() => setCameraVisible(false)} onCapture={onCameraCapture} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },

  pageHeader: { marginBottom: 20 },
  pageTitle: { fontFamily: font.bold, fontSize: 24, color: AppColors.textPrimary },
  pageSubtitle: { marginTop: 6, fontFamily: font.regular, fontSize: 13, color: AppColors.textSecondary },

  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 16,
  },

  sectionLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  requiredMark: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.error },
  requiredBadge: { fontFamily: font.semiBold, fontSize: 11, color: AppColors.error },
  // Plain block-level helper text (Images/Videos section). textAlignVertical
  // only has an effect on TextInput, not Text — dropped, it was a no-op here.
  helperText: { fontFamily: font.regular, fontSize: 11.5, color: AppColors.textTertiary, marginBottom: 10 },
  // Separate style for the voice-note row's helper text, which sits beside
  // the Record button and needs flex:1 to wrap instead of overflowing —
  // giving the block-level helperText above flex:1 would stretch it
  // vertically inside its column layout, which is why these are split.
  voiceHelperText: { flex: 1, fontFamily: font.regular, fontSize: 11.5, color: AppColors.textTertiary },

  textArea: {
    minHeight: 84,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.background,
    padding: 12,
    fontFamily: font.medium,
    fontSize: 13,
    color: AppColors.textPrimary,
    textAlignVertical: 'top',
  },

  // Media upload
  mediaBtnRow: { flexDirection: 'row', gap: 10 },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.primaryLight,
    borderStyle: 'dashed',
    backgroundColor: AppColors.warningLight,
  },
  uploadBtnText: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.primaryDark },
  fileHint: { marginTop: 8, fontFamily: font.regular, fontSize: 10.5, color: AppColors.textTertiary },

  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  mediaThumbWrap: { width: 80, height: 80, borderRadius: 12, overflow: 'visible' },
  mediaThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: AppColors.secondary,
  },
  videoBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mediaRemoveBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.error,
  },

  // Voice note — dropped the redundant `alignContent: 'center'` (only
  // matters for wrapping flex containers; this row never wraps).
  voiceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
  },
  recordBtnActive: { backgroundColor: AppColors.error },
  recordBtnText: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.white },

  previewRow: { marginTop: 12, gap: 10 },
  previewLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  previewPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.background,
  },
  previewPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
  },
  previewTime: { fontFamily: font.medium, fontSize: 11, color: AppColors.textSecondary, minWidth: 70 },
  previewTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: AppColors.border, overflow: 'hidden' },
  previewProgress: { height: '100%', backgroundColor: AppColors.primary },
  addClipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: AppColors.primary,
  },
  addClipBtnPressed: { backgroundColor: AppColors.primaryDark },
  addClipBtnText: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.white },

  voiceNoteList: { marginTop: 12, gap: 8 },
  voiceNoteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: AppColors.warningLight,
  },
  voiceNoteChipText: { flex: 1, fontFamily: font.medium, fontSize: 12, color: AppColors.textPrimary },

  errorText: { marginTop: 8, fontFamily: font.medium, fontSize: 11, color: AppColors.error },

  // Timing
  timingRow: { flexDirection: 'row', gap: 24, marginVertical: 20 },
  timingOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: AppColors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: AppColors.primary },
  timingLabel: { fontFamily: font.medium, fontSize: 13, color: AppColors.textPrimary },

  // Service address card
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  addressCardPressed: { backgroundColor: AppColors.warningLight },
  addressIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  addressLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  addressDetail: { marginTop: 2, fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  changeText: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.primary },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  bookBtnPressed: { backgroundColor: AppColors.primaryDark },
  bookBtnText: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.white },
});
