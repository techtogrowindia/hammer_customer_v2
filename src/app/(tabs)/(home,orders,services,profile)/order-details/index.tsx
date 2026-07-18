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
import { useLocalSearchParams } from 'expo-router';
import {
  AlertTriangle,
  Award,
  Ban,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Mic,
  Pause,
  PauseCircle,
  Play,
  Receipt,
  ShieldCheck,
  Star,
  Trash2,
  Wrench,
  X,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OrderStatus = 'pending' | 'quoted' | 'confirmed' | 'on_hold' | 'completing' | 'completed' | 'cancelled';

// Only meaningful while status === 'confirmed'. Drives cancellation rules:
// assigned -> free cancel, reached -> cancel with fee, started -> can't cancel.
type ConfirmedPhase = 'assigned' | 'reached' | 'started';

type Technician = {
  name: string;
  avatarUrl?: string;
  verified: boolean;
  premium: boolean;
  skills: string[];
  rating: number;
  ratingCount: number;
  distanceKm: number;
  openNow: boolean;
};

type QuoteOffer = {
  id: string;
  technician: Technician;
  amount: number;
  submittedAt: string;
};

type AdditionalQuote = {
  id: string;
  description: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
};

type Order = {
  id: string;
  service: string;
  createdAt: string;
  status: OrderStatus;
  isProductOrder: boolean; // gates the "Concern with product" option post-completion
  offers: QuoteOffer[];
  acceptedOffer?: QuoteOffer;
  confirmedPhase?: ConfirmedPhase;
  etaMinutes?: number;
  additionalQuotes: AdditionalQuote[];
  holdReason?: string;
  completionOtp?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationFee?: number;
  concernWindowDaysLeft?: number;
  review?: { rating: number; comment: string };
};

// ---------------------------------------------------------------------------
// Mock data — one entry per case
// ---------------------------------------------------------------------------

const TECH_A: Technician = {
  name: 'Electrical And Plumbing Work',
  avatarUrl: 'https://i.pravatar.cc/200?img=33',
  verified: true,
  premium: true,
  skills: ['Electrician', 'Plumbing'],
  rating: 0,
  ratingCount: 0,
  distanceKm: 0,
  openNow: true,
};

const TECH_B: Technician = {
  name: 'Manikandan R',
  avatarUrl: 'https://i.pravatar.cc/200?img=15',
  verified: true,
  premium: true,
  skills: ['Electrician', 'Civil & Construction', 'Fabrication', 'Plumbing'],
  rating: 4,
  ratingCount: 2,
  distanceKm: 0,
  openNow: true,
};

const TECH_C: Technician = {
  name: 'Kalingarayan Electrical CCTV & Solar',
  avatarUrl: 'https://i.pravatar.cc/200?img=52',
  verified: false,
  premium: true,
  skills: ['CCTV', 'Solar Panel Installation'],
  rating: 0,
  ratingCount: 0,
  distanceKm: 0,
  openNow: true,
};

const GOWSIC: Technician = {
  name: 'Aswick Jothi',
  avatarUrl: 'https://i.pravatar.cc/200?img=8',
  verified: true,
  premium: true,
  skills: ['Carpentry', 'Door Repair'],
  rating: 4.6,
  ratingCount: 18,
  distanceKm: 2.4,
  openNow: true,
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'pending-demo',
    service: 'AC Installation',
    createdAt: '14 Feb 2026, 01:24 PM',
    status: 'pending',
    isProductOrder: true,
    offers: [],
    additionalQuotes: [],
  },
  {
    id: 'quoted-demo',
    service: 'AC Installation',
    createdAt: '14 Feb 2026, 01:24 PM',
    status: 'quoted',
    isProductOrder: true,
    offers: [
      { id: 'q1', technician: TECH_A, amount: 900, submittedAt: '01:40 PM' },
      { id: 'q2', technician: TECH_B, amount: 1100, submittedAt: '01:52 PM' },
      { id: 'q3', technician: TECH_C, amount: 950, submittedAt: '02:03 PM' },
    ],
    additionalQuotes: [],
  },
  {
    id: 'confirmed-assigned-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'confirmed',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'assigned',
    etaMinutes: 25,
    additionalQuotes: [],
  },
  {
    id: 'confirmed-reached-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'confirmed',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'reached',
    additionalQuotes: [],
  },
  {
    id: 'addlquote-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'confirmed',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'started',
    additionalQuotes: [
      { id: 'a1', description: 'Extra work — replaced hinge assembly', amount: 500, status: 'pending' },
    ],
  },
  {
    id: 'hold-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'on_hold',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'started',
    holdReason: 'Waiting for a replacement hinge part — expected to resume within 2 hours.',
    additionalQuotes: [
      { id: 'a1', description: 'Extra work — replaced hinge assembly', amount: 500, status: 'confirmed' },
    ],
  },
  {
    id: 'completing-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'completing',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'started',
    additionalQuotes: [
      { id: 'a1', description: 'Extra work — replaced hinge assembly', amount: 500, status: 'confirmed' },
    ],
    completionOtp: '4821',
  },
  {
    id: 'completed-demo',
    service: 'Door Repair',
    createdAt: '31 Jan 2026, 01:33 PM',
    status: 'completed',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' }],
    acceptedOffer: { id: 'q1', technician: GOWSIC, amount: 1000, submittedAt: '01:35 PM' },
    confirmedPhase: 'started',
    additionalQuotes: [
      { id: 'a1', description: 'Extra work — replaced hinge assembly', amount: 500, status: 'confirmed' },
    ],
    completedAt: '31 Jan 2026, 04:10 PM',
    concernWindowDaysLeft: 6,
  },
  {
    id: 'cancelled-demo',
    service: 'Bathroom Deep Cleaning',
    createdAt: '10 Feb 2026, 11:00 AM',
    status: 'cancelled',
    isProductOrder: false,
    offers: [{ id: 'q1', technician: TECH_A, amount: 650, submittedAt: '11:10 AM' }],
    acceptedOffer: { id: 'q1', technician: TECH_A, amount: 650, submittedAt: '11:10 AM' },
    confirmedPhase: 'reached',
    additionalQuotes: [],
    cancelledAt: '11:45 AM',
    cancellationFee: 100,
  },
];

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: AppColors.textSecondary, bg: AppColors.divider },
  quoted: { label: 'Quotes received', color: AppColors.primaryDark, bg: AppColors.warningLight },
  confirmed: { label: 'Processing', color: AppColors.primaryDark, bg: AppColors.warningLight },
  on_hold: { label: 'On hold', color: AppColors.error, bg: '#FDE8E8' },
  completing: { label: 'Awaiting confirmation', color: AppColors.primaryDark, bg: AppColors.warningLight },
  completed: { label: 'Completed', color: AppColors.success, bg: '#E6F4EA' },
  cancelled: { label: 'Cancelled', color: AppColors.error, bg: '#FDE8E8' },
};

const genTicketId = () => `TCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
      <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  destructive,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!visible) return null;
  return (
    <View style={styles.modalOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
      <View style={styles.modalCard}>
        <View style={[styles.modalIconWrap, destructive && styles.modalIconWrapDanger]}>
          <AlertTriangle size={22} color={destructive ? AppColors.error : AppColors.primary} strokeWidth={2.25} />
        </View>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <View style={styles.modalActions}>
          <Pressable
            accessibilityRole='button'
            onPress={onCancel}
            style={({ pressed }) => [styles.modalBtnSecondary, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
          </Pressable>
          <Pressable
            accessibilityRole='button'
            onPress={onConfirm}
            style={({ pressed }) => [
              styles.modalBtnPrimary,
              destructive && styles.modalBtnDanger,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.modalBtnPrimaryText}>{confirmLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function TechnicianBadgeRow({ technician }: { technician: Technician }) {
  return (
    <View style={styles.techBadgeRow}>
      {technician.verified && (
        <View style={styles.techBadge}>
          <ShieldCheck size={11} color={AppColors.success} strokeWidth={2.5} />
          <Text style={[styles.techBadgeText, { color: AppColors.success }]}>Verified</Text>
        </View>
      )}
      {technician.premium && (
        <View style={[styles.techBadge, { backgroundColor: AppColors.warningLight }]}>
          <Award size={11} color={AppColors.primaryDark} strokeWidth={2.5} />
          <Text style={[styles.techBadgeText, { color: AppColors.primaryDark }]}>Premium</Text>
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Quote list (status === 'quoted')
// ---------------------------------------------------------------------------

function QuoteOfferCard({
  offer,
  expanded,
  onToggle,
  onConfirm,
}: {
  offer: QuoteOffer;
  expanded: boolean;
  onToggle: () => void;
  onConfirm: () => void;
}) {
  const { technician } = offer;
  return (
    <View style={styles.offerCard}>
      <View style={styles.offerTopRow}>
        <View style={styles.offerAvatarWrap}>
          {technician.avatarUrl ? (
            <Image source={{ uri: technician.avatarUrl }} style={styles.offerAvatar} resizeMode='cover' />
          ) : (
            <View style={[styles.offerAvatar, styles.offerAvatarFallback]}>
              <Text style={styles.offerAvatarFallbackText}>{technician.name.charAt(0)}</Text>
            </View>
          )}
          {technician.openNow && <View style={styles.openDot} />}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.offerName} numberOfLines={1}>
            {technician.name}
          </Text>
          <TechnicianBadgeRow technician={technician} />
          <Text style={styles.offerSkills} numberOfLines={1}>
            {technician.skills.join(', ')}
          </Text>
          <View style={styles.offerMetaRow}>
            <Star
              size={11}
              color={AppColors.primary}
              strokeWidth={2}
              fill={technician.rating > 0 ? AppColors.primary : 'transparent'}
            />
            <Text style={styles.offerMetaText}>
              {technician.rating.toFixed(1)} ({technician.ratingCount}) · {technician.distanceKm} km
            </Text>
          </View>
        </View>

        <Text style={styles.offerAmount}>₹{offer.amount.toLocaleString('en-IN')}</Text>
      </View>

      <Pressable accessibilityRole='button' onPress={onToggle} style={styles.offerToggleRow}>
        <Text style={styles.offerToggleText}>{expanded ? 'Hide details' : 'View quote'}</Text>
        {expanded ? (
          <ChevronUp size={14} color={AppColors.primary} strokeWidth={2.25} />
        ) : (
          <ChevronDown size={14} color={AppColors.primary} strokeWidth={2.25} />
        )}
      </Pressable>

      {expanded && (
        <View style={styles.offerDetails}>
          <Text style={styles.offerDetailsText}>
            Submitted at {offer.submittedAt} · Quote covers service charges only. Material and any extra work will be
            billed separately with your confirmation.
          </Text>
          <Pressable
            accessibilityRole='button'
            onPress={onConfirm}
            style={({ pressed }) => [styles.offerConfirmBtn, pressed && styles.offerConfirmBtnPressed]}
          >
            <Check size={15} color={AppColors.white} strokeWidth={2.5} />
            <Text style={styles.offerConfirmBtnText}>Confirm this quote</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Review + Raise concern (status === 'completed')
// ---------------------------------------------------------------------------

function ReviewCard({ onSubmit }: { onSubmit: (rating: number, comment: string) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <View style={styles.card}>
        <View style={styles.reviewSubmittedRow}>
          <CheckCircle2 size={18} color={AppColors.success} strokeWidth={2.25} />
          <Text style={styles.reviewSubmittedText}>Thanks for your review!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Rate your experience</Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable accessibilityRole='button' key={n} onPress={() => setRating(n)} hitSlop={6}>
            <Star
              size={26}
              color={AppColors.primary}
              strokeWidth={1.75}
              fill={n <= rating ? AppColors.primary : 'transparent'}
            />
          </Pressable>
        ))}
      </View>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder='Tell us how the service went (optional)'
        placeholderTextColor={AppColors.textTertiary}
        multiline
        numberOfLines={3}
        style={styles.textArea}
      />
      <Pressable
        accessibilityRole='button'
        disabled={rating === 0}
        onPress={() => {
          onSubmit(rating, comment);
          setSubmitted(true);
        }}
        style={({ pressed }) => [
          styles.reviewSubmitBtn,
          rating === 0 && { opacity: 0.5 },
          pressed && rating > 0 && { backgroundColor: AppColors.primaryDark },
        ]}
      >
        <Text style={styles.reviewSubmitBtnText}>Submit review</Text>
      </Pressable>
    </View>
  );
}

type ConcernType = 'service' | 'product';

function RaiseConcernCard({ isProductOrder, daysLeft }: { isProductOrder: boolean; daysLeft: number }) {
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

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function OrderDetailsScreen() {
  const { bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  const initialOrder = MOCK_ORDERS.find((o) => o.id === params.id) ?? MOCK_ORDERS[0];
  const [order, setOrder] = useState<Order>(initialOrder);

  // --- DEV-ONLY: lets you flip through every case without re-navigating.
  // Safe to delete this block (and the `caseSwitcher` styles) once you're
  // happy with the UI for each state.
  const switchCase = (id: string) => {
    const next = MOCK_ORDERS.find((o) => o.id === id);
    if (next) setOrder(next);
  };
  // ---

  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<
    | { kind: 'offer'; offer: QuoteOffer }
    | { kind: 'additional'; quote: AdditionalQuote }
    | { kind: 'cancel'; fee: number }
    | null
  >(null);
  const total = useMemo(() => {
    const base = order.acceptedOffer?.amount ?? 0;
    const extra = order.additionalQuotes.filter((q) => q.status === 'confirmed').reduce((sum, q) => sum + q.amount, 0);
    return base + extra;
  }, [order.acceptedOffer, order.additionalQuotes]);

  const confirmOffer = (offer: QuoteOffer) => setPendingConfirm({ kind: 'offer', offer });
  const acceptAdditionalQuote = (quote: AdditionalQuote) => setPendingConfirm({ kind: 'additional', quote });

  const declineAdditionalQuote = (quote: AdditionalQuote) => {
    Alert.alert('Decline extra charge?', `"${quote.description}" (₹${quote.amount}) won't be added to your order.`, [
      { text: 'Keep pending', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: () =>
          setOrder((prev) => ({
            ...prev,
            additionalQuotes: prev.additionalQuotes.map((q) => (q.id === quote.id ? { ...q, status: 'rejected' } : q)),
          })),
      },
    ]);
  };

  const requestCancel = () => {
    if (order.confirmedPhase === 'started') {
      Alert.alert("Can't cancel", 'This order is already being worked on and can no longer be cancelled.');
      return;
    }
    const fee = order.confirmedPhase === 'reached' ? Math.round((order.acceptedOffer?.amount ?? 0) * 0.15) : 0;
    setPendingConfirm({ kind: 'cancel', fee });
  };

  const runConfirm = () => {
    if (!pendingConfirm) return;

    if (pendingConfirm.kind === 'offer') {
      setOrder((prev) => ({
        ...prev,
        status: 'confirmed',
        acceptedOffer: pendingConfirm.offer,
        confirmedPhase: 'assigned',
        etaMinutes: 30,
      }));
    } else if (pendingConfirm.kind === 'additional') {
      setOrder((prev) => ({
        ...prev,
        additionalQuotes: prev.additionalQuotes.map((q) =>
          q.id === pendingConfirm.quote.id ? { ...q, status: 'confirmed' } : q,
        ),
      }));
    } else if (pendingConfirm.kind === 'cancel') {
      setOrder((prev) => ({
        ...prev,
        status: 'cancelled',
        cancelledAt: 'just now',
        cancellationFee: pendingConfirm.fee,
      }));
    }
    setPendingConfirm(null);
  };

  const canShowCancel = order.status === 'pending' || order.status === 'quoted' || order.status === 'confirmed';

  return (
    <View style={styles.screen}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* DEV-ONLY case switcher — delete this View once done reviewing */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.caseSwitcher}>
          {MOCK_ORDERS.map((o) => (
            <Pressable
              key={o.id}
              onPress={() => switchCase(o.id)}
              style={[styles.caseChip, order.id === o.id && styles.caseChipActive]}
            >
              <Text style={[styles.caseChipText, order.id === o.id && styles.caseChipTextActive]}>{o.id}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Order header */}
        <View style={styles.orderHeaderCard}>
          <View style={styles.orderHeaderTopRow}>
            <Text style={styles.orderEyebrow}>ORDER</Text>
            <StatusPill status={order.status} />
          </View>
          <Text style={styles.orderTitle}>{order.service}</Text>
          <Text style={styles.orderDate}>{order.createdAt}</Text>
        </View>

        {/* ---- PENDING: no quotes yet ---- */}
        {order.status === 'pending' && (
          <View style={styles.card}>
            <View style={styles.pendingRow}>
              <View style={styles.pendingIconWrap}>
                <Clock size={18} color={AppColors.primary} strokeWidth={2.25} />
              </View>
              <Text style={styles.pendingText}>
                No quotes yet. Technicians in your area have been notified and may send quotes soon.
              </Text>
            </View>
          </View>
        )}

        {/* ---- QUOTED: technicians have sent quotes, awaiting selection ---- */}
        {order.status === 'quoted' && (
          <View style={{ gap: 10 }}>
            <Text style={styles.sectionLabel}>
              {order.offers.length} quote{order.offers.length === 1 ? '' : 's'} received
            </Text>
            {order.offers.map((offer) => (
              <QuoteOfferCard
                key={offer.id}
                offer={offer}
                expanded={expandedOfferId === offer.id}
                onToggle={() => setExpandedOfferId((prev) => (prev === offer.id ? null : offer.id))}
                onConfirm={() => confirmOffer(offer)}
              />
            ))}
          </View>
        )}

        {/* ---- CONFIRMED / ON HOLD / COMPLETING / COMPLETED: technician assigned ---- */}
        {order.acceptedOffer &&
          (order.status === 'confirmed' ||
            order.status === 'on_hold' ||
            order.status === 'completing' ||
            order.status === 'completed') && (
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Your technician</Text>
              <View style={styles.techRow}>
                {order.acceptedOffer.technician.avatarUrl ? (
                  <Image source={{ uri: order.acceptedOffer.technician.avatarUrl }} style={styles.techAvatar} />
                ) : (
                  <View style={[styles.techAvatar, styles.offerAvatarFallback]}>
                    <Text style={styles.offerAvatarFallbackText}>{order.acceptedOffer.technician.name.charAt(0)}</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.techName}>{order.acceptedOffer.technician.name}</Text>
                  <TechnicianBadgeRow technician={order.acceptedOffer.technician} />
                </View>
              </View>

              {order.status === 'confirmed' && (
                <View style={styles.phaseBanner}>
                  <Wrench size={14} color={AppColors.primaryDark} strokeWidth={2.25} />
                  <Text style={styles.phaseBannerText}>
                    {order.confirmedPhase === 'assigned' && `On the way · ETA ~${order.etaMinutes ?? 30} min`}
                    {order.confirmedPhase === 'reached' && 'Technician has reached your location'}
                    {order.confirmedPhase === 'started' && 'Work is currently in progress'}
                  </Text>
                </View>
              )}
            </View>
          )}

        {/* ---- Additional quote pending customer confirmation ---- */}
        {order.additionalQuotes.some((q) => q.status === 'pending') && (
          <View style={[styles.card, styles.additionalCard]}>
            <View style={styles.cardHeaderRow}>
              <AlertTriangle size={15} color={AppColors.primaryDark} strokeWidth={2.25} />
              <Text style={styles.sectionLabel}>Technician requested extra charges</Text>
            </View>
            {order.additionalQuotes
              .filter((q) => q.status === 'pending')
              .map((q) => (
                <View key={q.id} style={styles.additionalRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.additionalDesc}>{q.description}</Text>
                    <Text style={styles.additionalAmount}>+ ₹{q.amount.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.additionalActions}>
                    <Pressable
                      accessibilityRole='button'
                      onPress={() => declineAdditionalQuote(q)}
                      style={({ pressed }) => [styles.additionalDeclineBtn, pressed && { opacity: 0.7 }]}
                    >
                      <X size={14} color={AppColors.error} strokeWidth={2.25} />
                    </Pressable>
                    <Pressable
                      accessibilityRole='button'
                      onPress={() => acceptAdditionalQuote(q)}
                      style={({ pressed }) => [styles.additionalConfirmBtn, pressed && styles.offerConfirmBtnPressed]}
                    >
                      <Check size={14} color={AppColors.white} strokeWidth={2.5} />
                      <Text style={styles.additionalConfirmBtnText}>Confirm</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* ---- On hold ---- */}
        {order.status === 'on_hold' && (
          <View style={[styles.card, styles.holdCard]}>
            <View style={styles.cardHeaderRow}>
              <PauseCircle size={16} color={AppColors.error} strokeWidth={2.25} />
              <Text style={[styles.sectionLabel, { color: AppColors.error }]}>Order on hold</Text>
            </View>
            <Text style={styles.holdReasonText}>{order.holdReason}</Text>
          </View>
        )}

        {/* ---- Completing: OTP to share with technician ---- */}
        {order.status === 'completing' && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <ShieldCheck size={15} color={AppColors.primary} strokeWidth={2.25} />
              <Text style={styles.sectionLabel}>Confirm job completion</Text>
            </View>
            <Text style={styles.helperText}>
              Your technician has marked this job as done. Share the code below with them to confirm completion.
            </Text>
            <View style={styles.otpBox}>
              <Text style={styles.otpText}>{order.completionOtp}</Text>
            </View>
            <Text style={styles.otpWarning}>Don't share this code with anyone except your technician.</Text>
          </View>
        )}

        {/* ---- Order breakdown — shown once a quote has been accepted ---- */}
        {order.acceptedOffer && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Receipt size={15} color={AppColors.textSecondary} strokeWidth={2.25} />
              <Text style={styles.sectionLabel}>Order value</Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Initial quote</Text>
              <Text style={styles.breakdownAmount}>₹{order.acceptedOffer.amount.toLocaleString('en-IN')}</Text>
            </View>

            {order.additionalQuotes
              .filter((q) => q.status === 'confirmed')
              .map((q) => (
                <View key={q.id} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} numberOfLines={1}>
                    {q.description}
                  </Text>
                  <Text style={styles.breakdownAmount}>₹{q.amount.toLocaleString('en-IN')}</Text>
                </View>
              ))}

            <View style={[styles.breakdownRow, styles.breakdownTotalRow]}>
              <Text style={styles.breakdownTotalLabel}>Total order value</Text>
              <Text style={styles.breakdownTotalAmount}>₹{total.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        )}

        {/* ---- Completed: review + raise concern ---- */}
        {order.status === 'completed' && (
          <>
            <ReviewCard
              onSubmit={(rating, comment) => setOrder((prev) => ({ ...prev, review: { rating, comment } }))}
            />
            <RaiseConcernCard isProductOrder={order.isProductOrder} daysLeft={order.concernWindowDaysLeft ?? 0} />
          </>
        )}

        {/* ---- Cancelled ---- */}
        {order.status === 'cancelled' && (
          <View style={[styles.card, styles.holdCard]}>
            <View style={styles.cardHeaderRow}>
              <Ban size={16} color={AppColors.error} strokeWidth={2.25} />
              <Text style={[styles.sectionLabel, { color: AppColors.error }]}>Order cancelled</Text>
            </View>
            <Text style={styles.holdReasonText}>Cancelled {order.cancelledAt}.</Text>
            {!!order.cancellationFee && (
              <Text style={[styles.holdReasonText, { marginTop: 4 }]}>
                A cancellation fee of ₹{order.cancellationFee} was applied since the technician had already reached your
                location.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {canShowCancel && (
        <View style={[styles.footer, { paddingBottom: bottom + 12 }]}>
          <Pressable
            accessibilityRole='button'
            onPress={requestCancel}
            style={({ pressed }) => [styles.cancelBtn, pressed && { backgroundColor: '#FDE8E8' }]}
          >
            <Ban size={15} color={AppColors.error} strokeWidth={2.25} />
            <Text style={styles.cancelBtnText}>Cancel order</Text>
          </Pressable>
        </View>
      )}

      <ConfirmSheet
        visible={pendingConfirm?.kind === 'offer'}
        title='Confirm this quote?'
        message={
          pendingConfirm?.kind === 'offer'
            ? `This confirms ₹${pendingConfirm.offer.amount} with ${pendingConfirm.offer.technician.name} for the service charges only. Any material cost or extra work will be billed separately and needs your confirmation before it's added.`
            : ''
        }
        confirmLabel='Confirm quote'
        onConfirm={runConfirm}
        onCancel={() => setPendingConfirm(null)}
      />

      <ConfirmSheet
        visible={pendingConfirm?.kind === 'additional'}
        title='Confirm extra charge?'
        message={
          pendingConfirm?.kind === 'additional'
            ? `This adds ₹${pendingConfirm.quote.amount} to your order total for: ${pendingConfirm.quote.description}.`
            : ''
        }
        confirmLabel='Confirm charge'
        onConfirm={runConfirm}
        onCancel={() => setPendingConfirm(null)}
      />

      <ConfirmSheet
        visible={pendingConfirm?.kind === 'cancel'}
        title='Cancel this order?'
        message={
          pendingConfirm?.kind === 'cancel'
            ? pendingConfirm.fee > 0
              ? `Your technician has already reached your location. A cancellation fee of ₹${pendingConfirm.fee} will apply.`
              : "This order hasn't started yet, so it can be cancelled free of charge."
            : ''
        }
        confirmLabel='Cancel order'
        destructive
        onConfirm={runConfirm}
        onCancel={() => setPendingConfirm(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: AppColors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 14 },

  // DEV-only switcher
  caseSwitcher: { marginBottom: -4 },
  caseChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: AppColors.divider,
    marginRight: 8,
  },
  caseChipActive: { backgroundColor: AppColors.primary },
  caseChipText: { fontFamily: font.medium, fontSize: 10.5, color: AppColors.textSecondary },
  caseChipTextActive: { color: AppColors.white },

  // Order header
  orderHeaderCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  orderHeaderTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderEyebrow: { fontFamily: font.semiBold, fontSize: 10.5, letterSpacing: 0.5, color: AppColors.textTertiary },
  orderTitle: { marginTop: 6, fontFamily: font.bold, fontSize: 18, color: AppColors.textPrimary },
  orderDate: { marginTop: 3, fontFamily: font.regular, fontSize: 12, color: AppColors.textSecondary },

  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusPillText: { fontFamily: font.semiBold, fontSize: 11 },

  // Generic card
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  helperText: { fontFamily: font.regular, fontSize: 11.5, color: AppColors.textTertiary, marginTop: 4 },
  emptyText: { fontFamily: font.regular, fontSize: 12, color: AppColors.textTertiary },

  // Pending
  pendingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pendingIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
  pendingText: { flex: 1, fontFamily: font.regular, fontSize: 12.5, lineHeight: 18, color: AppColors.textSecondary },

  // Offer card
  offerCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  offerTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  offerAvatarWrap: { position: 'relative' },
  offerAvatar: { width: 46, height: 46, borderRadius: 14 },
  offerAvatarFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: AppColors.warningLight },
  offerAvatarFallbackText: { fontFamily: font.semiBold, fontSize: 16, color: AppColors.primaryDark },
  openDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.success,
    borderWidth: 2,
    borderColor: AppColors.surface,
  },
  offerName: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  techBadgeRow: { flexDirection: 'row', gap: 6, marginTop: 3 },
  techBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#E6F4EA',
  },
  techBadgeText: { fontFamily: font.semiBold, fontSize: 9.5 },
  offerSkills: { marginTop: 4, fontFamily: font.regular, fontSize: 11, color: AppColors.textSecondary },
  offerMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  offerMetaText: { fontFamily: font.regular, fontSize: 10.5, color: AppColors.textTertiary },
  offerAmount: { fontFamily: font.bold, fontSize: 15, color: AppColors.textPrimary },

  offerToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AppColors.divider,
  },
  offerToggleText: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.primary },
  offerDetails: { marginTop: 10 },
  offerDetailsText: { fontFamily: font.regular, fontSize: 11.5, lineHeight: 17, color: AppColors.textSecondary },
  offerConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: AppColors.primary,
  },
  offerConfirmBtnPressed: { backgroundColor: AppColors.primaryDark },
  offerConfirmBtnText: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.white },

  // Technician assigned
  techRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  techAvatar: { width: 48, height: 48, borderRadius: 14 },
  techName: { fontFamily: font.semiBold, fontSize: 13.5, color: AppColors.textPrimary },

  phaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    padding: 10,
    borderRadius: 12,
    backgroundColor: AppColors.warningLight,
  },
  phaseBannerText: { fontFamily: font.medium, fontSize: 12, color: AppColors.primaryDark },

  // Additional quote
  additionalCard: { borderColor: AppColors.primaryLight, backgroundColor: AppColors.warningLight },
  additionalRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  additionalDesc: { fontFamily: font.medium, fontSize: 12.5, color: AppColors.textPrimary },
  additionalAmount: { marginTop: 3, fontFamily: font.bold, fontSize: 14, color: AppColors.textPrimary },
  additionalActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  additionalDeclineBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  additionalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
  },
  additionalConfirmBtnText: { fontFamily: font.semiBold, fontSize: 12, color: AppColors.white },

  // Hold / cancelled
  holdCard: { borderColor: '#F5C6C6', backgroundColor: '#FDE8E8' },
  holdReasonText: { fontFamily: font.regular, fontSize: 12.5, lineHeight: 18, color: AppColors.textSecondary },

  // OTP
  otpBox: {
    marginTop: 12,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderStyle: 'dashed',
  },
  otpText: { fontFamily: font.bold, fontSize: 30, letterSpacing: 10, color: AppColors.textPrimary },
  otpWarning: { marginTop: 10, fontFamily: font.medium, fontSize: 11, color: AppColors.error, textAlign: 'center' },

  // Breakdown
  breakdownRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  breakdownLabel: { flex: 1, fontFamily: font.regular, fontSize: 12.5, color: AppColors.textSecondary, marginRight: 8 },
  breakdownAmount: { fontFamily: font.semiBold, fontSize: 12.5, color: AppColors.textPrimary },
  breakdownTotalRow: { marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: AppColors.divider },
  breakdownTotalLabel: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },
  breakdownTotalAmount: { fontFamily: font.bold, fontSize: 16, color: AppColors.textPrimary },

  // Review
  starRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  textArea: {
    minHeight: 72,
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
  reviewSubmitBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: AppColors.primary,
  },
  reviewSubmitBtnText: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.white },
  reviewSubmittedRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewSubmittedText: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textPrimary },

  // Concern
  concernTypeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  concernTypeChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: AppColors.background,
  },
  concernTypeChipSelected: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  concernTypeText: { fontFamily: font.medium, fontSize: 12, color: AppColors.textSecondary },
  concernTypeTextSelected: { color: AppColors.white },

  voiceRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
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
  clipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: AppColors.background,
  },
  clipLabel: { fontFamily: font.medium, fontSize: 11.5, color: AppColors.textPrimary },

  // Footer (cancel)
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.surface,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AppColors.error,
  },
  cancelBtnText: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.error },

  // Confirm modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    padding: 22,
    backgroundColor: AppColors.white,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
    marginBottom: 12,
  },
  modalIconWrapDanger: { backgroundColor: '#FDE8E8' },
  modalTitle: { fontFamily: font.bold, fontSize: 16, color: AppColors.textPrimary, textAlign: 'center' },
  modalMessage: {
    marginTop: 8,
    fontFamily: font.regular,
    fontSize: 12.5,
    lineHeight: 18,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' },
  modalBtnSecondary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  modalBtnSecondaryText: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.textSecondary },
  modalBtnPrimary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    backgroundColor: AppColors.primary,
  },
  modalBtnDanger: { backgroundColor: AppColors.error },
  modalBtnPrimaryText: { fontFamily: font.semiBold, fontSize: 13, color: AppColors.white },
});
