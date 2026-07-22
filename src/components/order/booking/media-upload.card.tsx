import { AppColors } from '@/core/theme/app-colors';
import { MediaItem } from '@/hooks/useMediaPicker';
import { Camera, Image as ImageIcon, Video as VideoIcon, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, Image as RNImage, Text, View } from 'react-native';
import { styles } from '../../../app/(tabs)/(home,orders,services,profile)/booking/[booking-id]';
import { VideoThumb } from './video-thumb';

interface Props {
  media: MediaItem[];
  onPickFromLibrary: () => void;
  onOpenCamera: () => void;
  onRemove: (id: string) => void;
  error?: string | null;
  showValidation: boolean;
}

export function MediaUploadCard({ media, onPickFromLibrary, onOpenCamera, onRemove, error, showValidation }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionLabelRow}>
        <Text style={styles.sectionLabel}>Images / Videos</Text>
        {/* <Text style={styles.requiredMark}>*</Text> */}
      </View>
      <Text style={styles.helperText}>At least one; add multiple for a better quote.</Text>

      <View style={styles.mediaBtnRow}>
        <Pressable
          accessibilityRole='button'
          onPress={onPickFromLibrary}
          style={({ pressed }) => [styles.uploadBtn, pressed && { backgroundColor: AppColors.warningLight }]}
        >
          <ImageIcon size={16} color={AppColors.primaryDark} strokeWidth={2} />
          <Text style={styles.uploadBtnText}>Choose from library</Text>
        </Pressable>
        <Pressable
          accessibilityRole='button'
          onPress={onOpenCamera}
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
                onPress={() => onRemove(item.id)}
                style={styles.mediaRemoveBtn}
              >
                <X size={12} color={AppColors.white} strokeWidth={3} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {showValidation && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
