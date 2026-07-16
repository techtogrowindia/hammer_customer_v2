import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { Camera, RotateCcw, Video as VideoIcon, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type CaptureResult = { uri: string; type: 'image' | 'video' };

interface CameraCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (result: CaptureResult) => void;
}

/**
 * Full-screen in-app camera for capturing a fresh photo or video directly,
 * as opposed to picking an existing one from the library (that flow stays
 * on expo-image-picker in BookingScreen). Requires both camera and
 * microphone permission since video capture records audio.
 */
export function CameraCaptureModal({ visible, onClose, onCapture }: CameraCaptureModalProps) {
  const { top, bottom } = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);

  const hasPermissions = cameraPermission?.granted && micPermission?.granted;

  const requestAll = async () => {
    await requestCameraPermission();
    await requestMicPermission();
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    if (mode === 'photo') {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo) onCapture({ uri: photo.uri, type: 'image' });
      onClose();
      return;
    }

    // Video: recordAsync() doesn't resolve until stopRecording() is called,
    // so the first tap starts recording and the second tap (isRecording ===
    // true) stops it — the await below then resolves with the file.
    if (!isRecording) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      setIsRecording(false);
      if (video) {
        onCapture({ uri: video.uri, type: 'video' });
        onClose();
      }
    } else {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <Modal visible={visible} animationType='slide' onRequestClose={onClose}>
      <View style={styles.container}>
        {hasPermissions ? (
          <>
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing={facing} />

            <View style={[styles.topBar, { paddingTop: top + 10 }]}>
              <Pressable accessibilityRole='button' onPress={onClose} style={styles.iconBtn} hitSlop={8}>
                <X size={20} color={AppColors.white} strokeWidth={2.25} />
              </Pressable>
              <Pressable
                accessibilityRole='button'
                onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
                style={styles.iconBtn}
                hitSlop={8}
              >
                <RotateCcw size={20} color={AppColors.white} strokeWidth={2.25} />
              </Pressable>
            </View>

            <View style={[styles.bottomBar, { paddingBottom: bottom + 20 }]}>
              <View style={styles.modeRow}>
                <Pressable accessibilityRole='button' onPress={() => setMode('photo')} style={styles.modeBtn}>
                  <Text style={[styles.modeText, mode === 'photo' && styles.modeTextActive]}>Photo</Text>
                </Pressable>
                <Pressable accessibilityRole='button' onPress={() => setMode('video')} style={styles.modeBtn}>
                  <Text style={[styles.modeText, mode === 'video' && styles.modeTextActive]}>Video</Text>
                </Pressable>
              </View>

              <Pressable
                accessibilityRole='button'
                onPress={handleCapture}
                style={[styles.captureBtn, isRecording && styles.captureBtnRecording]}
              >
                {mode === 'video' && isRecording ? (
                  <View style={styles.captureStopSquare} />
                ) : mode === 'video' ? (
                  <VideoIcon size={22} color={AppColors.white} strokeWidth={2.25} />
                ) : (
                  <Camera size={22} color={AppColors.white} strokeWidth={2.25} />
                )}
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.permissionWrap}>
            <Camera size={40} color={AppColors.white} strokeWidth={1.5} />
            <Text style={styles.permissionTitle}>Camera access needed</Text>
            <Text style={styles.permissionText}>
              Allow camera and microphone access to capture photos or videos of the issue.
            </Text>
            <Pressable accessibilityRole='button' onPress={requestAll} style={styles.permissionBtn}>
              <Text style={styles.permissionBtnText}>Grant Access</Text>
            </Pressable>
            <Pressable accessibilityRole='button' onPress={onClose} hitSlop={8}>
              <Text style={styles.permissionCancelText}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.black },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', gap: 20 },
  modeRow: { flexDirection: 'row', gap: 24 },
  modeBtn: { paddingHorizontal: 4, paddingVertical: 6 },
  modeText: { fontFamily: font.semiBold, fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  modeTextActive: { color: AppColors.white },
  captureBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureBtnRecording: { backgroundColor: AppColors.error },
  captureStopSquare: { width: 20, height: 20, borderRadius: 4, backgroundColor: AppColors.white },
  permissionWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  permissionTitle: { fontFamily: font.bold, fontSize: 17, color: AppColors.white },
  permissionText: { fontFamily: font.regular, fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  permissionBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: AppColors.primary,
  },
  permissionBtnText: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.white },
  permissionCancelText: { marginTop: 4, fontFamily: font.regular, fontSize: 13, color: 'rgba(255,255,255,0.6)' },
});

export default CameraCaptureModal;
