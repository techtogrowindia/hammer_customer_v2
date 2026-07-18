import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import {
  CalendarClock,
  CalendarDays,
  Check,
  Clock,
  ImageUp,
  MapPin,
  MicVocal,
  Pause,
  Play,
  Share2,
  Sparkles,
  SquareDashedText,
  Video as VideoIcon,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, Image as RNImage, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

type MediaItem = { id: string; uri: string; type: 'image' | 'video' };
type VoiceNote = { id: string; uri: string; durationSeconds: number };

const formatDuration = (seconds: number) => {
  const totalSeconds = Math.floor(seconds || 0);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const safeParse = <T,>(value: string | undefined, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

// Same paused-first-frame video thumbnail as the booking screen.
function VideoThumb({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.pause();
  });
  return <VideoView player={player} style={styles.mediaThumb} contentFit='cover' nativeControls={false} />;
}

function VoiceNoteRow({ note, index }: { note: VoiceNote; index: number }) {
  const player = useAudioPlayer(note.uri);
  const status = useAudioPlayerStatus(player);

  const toggle = () => {
    if (status.playing) {
      player.pause();
    } else {
      if (status.didJustFinish) player.seekTo(0);
      player.play();
    }
  };

  const progress = note.durationSeconds ? Math.min(100, ((status.currentTime ?? 0) / note.durationSeconds) * 100) : 0;

  return (
    <View style={styles.voiceNoteRow}>
      <Pressable accessibilityRole='button' onPress={toggle} style={styles.voiceNotePlayBtn} hitSlop={6}>
        {status.playing ? (
          <Pause size={13} color={AppColors.white} strokeWidth={2.25} />
        ) : (
          <Play size={13} color={AppColors.white} strokeWidth={2.25} />
        )}
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={styles.voiceNoteTitle}>Voice note {index + 1}</Text>
        <View style={styles.voiceNoteTrack}>
          <View style={[styles.voiceNoteProgress, { width: `${progress}%` }]} />
        </View>
      </View>
      <Text style={styles.voiceNoteDuration}>
        {formatDuration(status.playing || status.currentTime ? status.currentTime : note.durationSeconds)}
      </Text>
    </View>
  );
}

export default function BookingConfirmationScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    issueText?: string;
    timing?: string;
    media?: string;
    voiceNotes?: string;
  }>();

  const bookingId = params.id ? `BK-${params.id.toUpperCase()}` : 'BK-8834521';
  const media = safeParse<MediaItem[]>(params.media, []);
  const voiceNotes = safeParse<VoiceNote[]>(params.voiceNotes, []);

  // Only the fields that make sense as single-line rows live here now —
  // Medias and Voice Note get their own sections below since they need
  // real visual previews, not a text value.
  const summaryRows = [
    { id: 'service', label: 'Service', value: 'Bathroom Deep Cleaning', Icon: Sparkles },
    {
      id: 'when',
      label: 'When',
      value: params.timing === 'later' ? 'Scheduled' : 'Immediate',
      Icon: CalendarClock,
    },
    { id: 'datetime', label: 'Date & time', value: 'Today, 12:00 – 3:00 PM', Icon: CalendarDays },
    { id: 'address', label: 'Address', value: 'Home · 123, 1st Main Road, Indiranagar', Icon: MapPin },
    {
      id: 'description',
      label: 'Description',
      value: params.issueText?.trim() || 'No description provided',
      Icon: SquareDashedText,
    },
  ];

  const goToTracking = () => {
    router.push({ pathname: '/orders/[id]', params: { id: params.id ?? '' } } as never);
  };

  const goHome = () => {
    router.replace('/' as never);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Success state */}
        <View style={styles.successBlock}>
          <View style={styles.checkRing}>
            <View style={styles.checkCircle}>
              <Check size={32} color={AppColors.white} strokeWidth={3} />
            </View>
          </View>

          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>Our service professional will be in touch with you shortly</Text>

          <View style={styles.bookingIdChip}>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingIdValue}>{bookingId}</Text>
          </View>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          {summaryRows.map((row, index) => (
            <View
              key={row.id}
              style={[styles.summaryRow, index !== summaryRows.length - 1 && styles.summaryRowDivider]}
            >
              <View style={styles.summaryIconWrap}>
                <row.Icon size={16} color={AppColors.primary} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue} numberOfLines={2}>
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Media attachments */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <ImageUp size={15} color={AppColors.primary} strokeWidth={2.25} />
            <Text style={styles.sectionLabel}>Photos & videos</Text>
          </View>

          {media.length > 0 ? (
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
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No photos or videos attached</Text>
          )}
        </View>

        {/* Voice notes */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MicVocal size={15} color={AppColors.primary} strokeWidth={2.25} />
            <Text style={styles.sectionLabel}>Voice notes</Text>
          </View>

          {voiceNotes.length > 0 ? (
            <View style={styles.voiceNoteList}>
              {voiceNotes.map((note, index) => (
                <VoiceNoteRow key={note.id} note={note} index={index} />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No voice note recorded</Text>
          )}
        </View>

        {/* Share */}
        <Pressable accessibilityRole='button' style={({ pressed }) => [styles.shareRow, pressed && { opacity: 0.7 }]}>
          <Share2 size={15} color={AppColors.primary} strokeWidth={2} />
          <Text style={styles.shareText}>Share booking details</Text>
        </Pressable>
      </ScrollView>

      {/* Actions */}
      <View style={[styles.actions, { paddingBottom: 16 }]}>
        <Pressable
          accessibilityRole='button'
          onPress={goToTracking}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
        >
          <Clock size={16} color={AppColors.white} strokeWidth={2.25} />
          <Text style={styles.primaryBtnText}>Track Booking</Text>
        </Pressable>

        <Pressable
          accessibilityRole='button'
          onPress={goHome}
          style={({ pressed }) => [styles.secondaryBtn, pressed && { backgroundColor: AppColors.warningLight }]}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 8 },

  // Success block
  successBlock: { alignItems: 'center', marginBottom: 28 },
  checkRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
    marginBottom: 20,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E9E5B',
  },
  successTitle: { fontFamily: font.bold, fontSize: 22, color: AppColors.textPrimary },
  successSubtitle: {
    marginTop: 8,
    fontFamily: font.regular,
    fontSize: 13,
    lineHeight: 19,
    color: AppColors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  bookingIdChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.border,
    borderStyle: 'dashed',
    backgroundColor: AppColors.surface,
  },
  bookingIdLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  bookingIdValue: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.textPrimary },

  // Summary card
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    overflow: 'hidden',
    marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  summaryRowDivider: { borderBottomWidth: 1, borderBottomColor: AppColors.divider },
  summaryIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  summaryLabel: { fontFamily: font.regular, fontSize: 11, color: AppColors.textTertiary },
  summaryValue: { marginTop: 3, fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },

  // Media / voice note cards (mirrors the booking screen's card style)
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    marginBottom: 16,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  emptyText: { fontFamily: font.regular, fontSize: 12, color: AppColors.textTertiary },

  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  mediaThumbWrap: { width: 72, height: 72, borderRadius: 12 },
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

  voiceNoteList: { gap: 10 },
  voiceNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: AppColors.background,
  },
  voiceNotePlayBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
  },
  voiceNoteTitle: { fontFamily: font.medium, fontSize: 12, color: AppColors.textPrimary, marginBottom: 6 },
  voiceNoteTrack: { height: 4, borderRadius: 2, backgroundColor: AppColors.border, overflow: 'hidden' },
  voiceNoteProgress: { height: '100%', backgroundColor: AppColors.primary },
  voiceNoteDuration: { fontFamily: font.medium, fontSize: 11, color: AppColors.textSecondary, minWidth: 34 },

  // Share row
  shareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 10 },
  shareText: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.primary },

  // Actions
  actions: {
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  primaryBtn: {
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
  primaryBtnPressed: { backgroundColor: AppColors.primaryDark },
  primaryBtnText: { fontFamily: font.semiBold, fontSize: 14, color: AppColors.white },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
  },
  secondaryBtnText: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textSecondary },
});
