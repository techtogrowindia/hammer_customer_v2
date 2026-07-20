import { CameraCaptureModal } from '@/components/common/camera/camera-capture-modal';
import AppLoader from '@/components/common/loader/app-loader';
import { AddressCard } from '@/components/order/booking/address-card';
import { BookingFooter } from '@/components/order/booking/footer';
import { IssueDescriptionCard } from '@/components/order/booking/issue-desc-card';
import { MediaUploadCard } from '@/components/order/booking/media-upload.card';
import { TimingScheduleCard } from '@/components/order/booking/scheduler-card';
import { VoiceNoteCard } from '@/components/order/booking/voice-note-card';
import { font } from '@/components/order/styles';
import { AppColors } from '@/core/theme/app-colors';
import { buildFilePayload, formatForApi } from '@/core/utils/order-helpers';
import { useMediaPicker } from '@/hooks/useMediaPicker';

import { useOrderApisHelper } from '@/hooks/useOrdersApisHelper';
import { useSchedule } from '@/hooks/useShedule';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useBoundStore } from '@/store/boundStore';
import { setAudioModeAsync } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/shallow';

export default function BookingScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { placeOrder } = useOrderApisHelper();
  const { showAppLoader, addressList } = useBoundStore(
    useShallow((state) => ({
      showAppLoader: state.showAppLoader,
      addressList: state.addressList,
    })),
  );

  const [issueText, setIssueText] = useState('');
  const [cameraVisible, setCameraVisible] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<number>(addressList[0]?.id ?? 0);

  const { media, pickFromLibrary, onCameraCapture, removeMedia } = useMediaPicker();
  const voiceRecorder = useVoiceRecorder();
  const schedule = useSchedule();

  useEffect(() => {
    setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
  }, []);

  const errors = {
    media: media.length === 0 ? 'Attach at least one image or video' : null,
    voice: voiceRecorder.voiceNotes.length === 0 ? 'A voice note is required' : null,
    schedule: schedule.timing === 'later' && !schedule.scheduledDate ? 'Pick a date and time' : null,
    address: !selectedAddressId ? 'Select a service address' : null,
  };
  const hasErrors = Boolean(errors.media || errors.voice || errors.schedule || errors.address);

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
      const voice_notes = voiceRecorder.voiceNotes.map((note) => buildFilePayload(note.uri, 'voice'));

      const response = await placeOrder({
        service_id: params.id,
        issue_description: issueText.trim() || 'No additional details provided.',
        type: schedule.timing === 'immediate' ? 'immediate' : 'scheduled',
        scheduled_at:
          schedule.timing === 'later' && schedule.scheduledDate
            ? formatForApi(schedule.scheduledDate)
            : formatForApi(new Date()),
        address_id: String(selectedAddressId),
        images,
        videos,
        voice_notes,
      });

      router.push({
        pathname: '/booking/confirm-booking' as never,
        params: { id: String(response?.data?.order_number ?? response?.data?.id ?? '') },
      });
    } catch {
      // Errors are already surfaced via toast inside useOrderApisHelper.placeOrder
    }
  };

  return (
    <View style={styles.screen}>
      <AppLoader visible={showAppLoader} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageSubtitle}>Add details and we'll connect you with a verified professional.</Text>

        <IssueDescriptionCard value={issueText} onChange={setIssueText} />

        <MediaUploadCard
          media={media}
          onPickFromLibrary={pickFromLibrary}
          onOpenCamera={() => setCameraVisible(true)}
          onRemove={removeMedia}
          error={errors.media}
          showValidation={showValidation}
        />

        <VoiceNoteCard
          isRecording={voiceRecorder.recorderState.isRecording}
          recordingDurationMillis={voiceRecorder.recorderState.durationMillis ?? 0}
          currentClip={voiceRecorder.currentClip}
          isPlaying={voiceRecorder.playerStatus.playing}
          currentTime={voiceRecorder.playerStatus.currentTime ?? 0}
          voiceNotes={voiceRecorder.voiceNotes}
          onToggleRecord={
            voiceRecorder.recorderState.isRecording ? voiceRecorder.stopRecording : voiceRecorder.startRecording
          }
          onTogglePlayback={voiceRecorder.togglePlayback}
          onDiscardClip={voiceRecorder.discardCurrentClip}
          onAddVoiceNote={voiceRecorder.addVoiceNote}
          onRemoveVoiceNote={voiceRecorder.removeVoiceNote}
          error={errors.voice}
          showValidation={showValidation}
        />

        <TimingScheduleCard
          timing={schedule.timing}
          scheduledDate={schedule.scheduledDate}
          pickerMode={schedule.pickerMode}
          onSelectTiming={schedule.selectTiming}
          onOpenDatePicker={schedule.openDatePicker}
          onOpenTimePicker={schedule.openTimePicker}
          onPickerChange={schedule.onPickerChange}
          error={errors.schedule}
          showValidation={showValidation}
        />

        <AddressCard
          addressList={addressList}
          setSelectedAddressId={setSelectedAddressId}
          selectedAddressId={selectedAddressId}
          error={errors.address}
          showValidation={showValidation}
        />
      </ScrollView>

      <BookingFooter onPress={bookService} />

      <CameraCaptureModal visible={cameraVisible} onClose={() => setCameraVisible(false)} onCapture={onCameraCapture} />
    </View>
  );
}

export const styles = StyleSheet.create({
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
