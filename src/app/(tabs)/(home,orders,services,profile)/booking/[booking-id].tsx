import { CameraCaptureModal } from '@/components/common/camera/camera-capture-modal';
import AppLoader from '@/components/common/loader/app-loader';
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useOrderApisHelper } from '@/hooks/useOrdersApisHelper';
import { useBoundStore } from '@/store/boundStore';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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
  Clock,
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
import {
  Alert,
  Platform,
  Pressable,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type MediaItem = { id: string; uri: string; type: 'image' | 'video' };
type VoiceNote = { id: string; uri: string; durationSeconds: number };
type ServiceTiming = 'immediate' | 'later';
type PickerMode = 'date' | 'time' | null;

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatDuration = (seconds: number) => {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const getFileName = (uri: string, fallbackPrefix: string, fallbackExtension: string) => {
  const rawName = uri.split('/').pop()?.split('?')[0];
  return rawName && rawName.includes('.') ? rawName : `${fallbackPrefix}-${genId()}.${fallbackExtension}`;
};

const getMimeType = (uri: string, fallbackType: string) => {
  const extension = uri.split('?')[0].split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'webm':
      return 'video/webm';
    case 'm4a':
      return 'audio/mp4';
    case 'aac':
      return 'audio/aac';
    case 'wav':
      return 'audio/wav';
    default:
      return fallbackType;
  }
};


const buildFilePayload = (uri: string, kind: 'image' | 'video' | 'voice') => {
  const fallbackExtension = kind === 'image' ? 'jpg' : kind === 'video' ? 'mp4' : 'm4a';
  const fallbackMimeType = kind === 'image' ? 'image/jpeg' : kind === 'video' ? 'video/mp4' : 'audio/mp4';
  return {
    uri,
    name: getFileName(uri, kind, fallbackExtension),
    type: getMimeType(uri, fallbackMimeType),
  };
};

const pad = (n: number) => String(n).padStart(2, '0');

const formatForApi = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:00`;

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

const formatTimeLabel = (date: Date) => date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });


function VideoThumb({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.pause();
  });
  return <VideoView player={player} style={styles.mediaThumb} contentFit='cover' nativeControls={false} />;
}

export default function BookingScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { placeOrder } = useOrderApisHelper();
  const { showAppLoader } = useBoundStore(
    useShallow((state) => ({
      showAppLoader: state.showAppLoader,
    })),
  );
  const [issueText, setIssueText] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [cameraVisible, setCameraVisible] = useState(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder, 200);
  const [currentClip, setCurrentClip] = useState<{ uri: string; durationSeconds: number } | null>(null);
  const player = useAudioPlayer(currentClip?.uri ?? null);
  const playerStatus = useAudioPlayerStatus(player);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);

  const [timing, setTiming] = useState<ServiceTiming>('immediate');

  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);



  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
  }, []);


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

  const errors = {
    media: media.length === 0 ? 'Attach at least one image or video' : null,
    voice: voiceNotes.length === 0 ? 'A voice note is required' : null,
    schedule: timing === 'later' && !scheduledDate ? 'Pick a date and time' : null,
  };
  const hasErrors = Boolean(errors.media || errors.voice || errors.schedule);

  const bookService = async () => {
    if (showAppLoader) return;
    if (hasErrors) {
      setShowValidation(true);
      return;
    }
    if (!params.id) {
      Alert.alert('Something went wrong', 'Missing service reference. Please go back and try again.');
      return;
    }

    try {
      const images = media.filter((item) => item.type === 'image').map((item) => buildFilePayload(item.uri, 'image'));
      const videos = media.filter((item) => item.type === 'video').map((item) => buildFilePayload(item.uri, 'video'));
      const voice_notes = voiceNotes.map((note) => buildFilePayload(note.uri, 'voice'));

      const response = await placeOrder({
        service_id: params.id,
        issue_description: issueText.trim() || 'No additional details provided.',
        type: timing === 'immediate' ? 'immediate' : 'scheduled',
        scheduled_at: timing === 'later' && scheduledDate ? formatForApi(scheduledDate) : '',
        address_id: '1',
        images,
        videos,
        voice_notes,
      });

      router.push({
        pathname: '/booking/confirm-booking' as never,
        params: { id: String(response?.data?.order_number ?? response?.data?.id ?? '') },
      });
    } catch {
    }
  };

  return (
    <View style={styles.screen}>
      <AppLoader visible={showAppLoader} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageSubtitle}>Add details and we'll connect you with a verified professional.</Text>

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
            <Text style={styles.requiredMark}>*</Text>
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
                  <Pressable accessibilityRole='button' hitSlop={6} onPress={() => removeVoiceNote(note.id)}>
                    <X size={13} color={AppColors.textTertiary} strokeWidth={2.25} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {showValidation && errors.voice && <Text style={styles.errorText}>{errors.voice}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>When do you need the service?</Text>
          <View style={styles.timingRow}>
            <Pressable
              accessibilityRole='button'
              onPress={() => selectTiming('immediate')}
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
              onPress={() => selectTiming('later')}
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
                onPress={openDatePicker}
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
                onPress={openTimePicker}
                style={({ pressed }) => [
                  styles.scheduleChip,
                  Boolean(scheduledDate) && styles.scheduleChipFilled,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Clock
                  size={14}
                  color={scheduledDate ? AppColors.primaryDark : AppColors.textTertiary}
                  strokeWidth={2}
                />
                <Text style={[styles.scheduleChipText, scheduledDate && styles.scheduleChipTextFilled]}>
                  {scheduledDate ? formatTimeLabel(scheduledDate) : 'Select time'}
                </Text>
              </Pressable>
            </View>
          )}

          {showValidation && errors.schedule && <Text style={styles.errorText}>{errors.schedule}</Text>}

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

        {/* Service address — shows the current default/selected address only;
            picking a different one happens on its own screen rather than
            duplicating a full address list + manual entry form here. */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Service address</Text>
          <Pressable
            accessibilityRole='button'
            onPress={() => router.push('/address/select-address' as never)}
            style={({ pressed }) => [styles.addressRow, pressed && { backgroundColor: AppColors.warningLight }]}
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
              </Text>
            </View>
            <View style={styles.changeRow}>
              <Text style={styles.changeText}>Change</Text>
              <ChevronRight size={16} color={AppColors.textTertiary} strokeWidth={2} />
            </View>
          </Pressable>
        </View>
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

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },

  pageSubtitle: { marginBottom: 16, fontFamily: font.regular, fontSize: 13, color: AppColors.textSecondary },

  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 16,
    gap: 8,
  },

  sectionLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  requiredMark: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.error },
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
  timingRow: { flexDirection: 'row', gap: 24, marginTop: 12 },
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

  // Service address row (sits inside the shared `card` style, so it no
  // longer redeclares its own border/radius/background)
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 12,
  },
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

  scheduleRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  scheduleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.background,
  },
  scheduleChipFilled: {
    borderColor: AppColors.primaryLight,
    backgroundColor: AppColors.warningLight,
  },
  scheduleChipText: { fontFamily: font.medium, fontSize: 12.5, color: AppColors.textTertiary },
  scheduleChipTextFilled: { color: AppColors.primaryDark, fontFamily: font.semiBold },
});
