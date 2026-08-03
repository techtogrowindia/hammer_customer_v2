import { ConfirmSheet } from '@/components/common/confirm-sheet/confirm-sheet';
import { RaiseConcernCard } from '@/components/order/concern-card';
import { MOCK_ORDERS } from '@/components/order/mock-data';
import { mapOrder } from '@/data/mappers/orders/map-order';
import { OrdersRepository } from '@/data/repositories/orders/orders-repository';
import { QuoteOfferCard } from '@/components/order/quote-offer-card';
import { ReviewCard } from '@/components/order/review-card';
import { StatusPill } from '@/components/order/status-pill';
import { styles } from '@/components/order/styles';
import { TechnicianBadgeRow } from '@/components/order/technician-badge-row';
import { AdditionalQuote, Order, PendingConfirm, QuoteOffer } from '@/components/order/types';
import { AppColors } from '@/core/theme/app-colors';
import { useLocalSearchParams } from 'expo-router';
import { AlertTriangle, Ban, Check, Clock, PauseCircle, Receipt, ShieldCheck, Wrench, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderDetailsScreen() {
  const { bottom } = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  const initialOrder = MOCK_ORDERS.find((o) => o.id === params.id) ?? MOCK_ORDERS[0];
  const [order, setOrder] = useState<Order>(initialOrder);
  const [busy, setBusy] = useState(false);

  // The screen used to render MOCK_ORDERS and nothing else, so every button
  // changed state on the phone and the server never heard about it.
  const orderId = Number(params.id);
  const reload = useCallback(async () => {
    if (!Number.isFinite(orderId) || orderId <= 0) return;
    try {
      const res = await OrdersRepository.getOrder(orderId);
      const rows = (res.data as any)?.orders ?? [];
      if (rows.length > 0) setOrder(mapOrder(rows[0]));
    } catch {
      // Leave whatever is on screen; a failed refresh must not blank the page.
    }
  }, [orderId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const switchCase = (id: string) => {
    const next = MOCK_ORDERS.find((o) => o.id === id);
    if (next) setOrder(next);
  };

  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm>(null);

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

  const runConfirm = async () => {
    if (!pendingConfirm || busy) return;
    const choice = pendingConfirm;
    setPendingConfirm(null);
    setBusy(true);

    try {
      if (choice.kind === 'offer') {
        const res = await OrdersRepository.confirmQuote(orderId, Number(choice.offer.id));
        if (!res.success) throw new Error(res.message);
      } else if (choice.kind === 'additional') {
        const res = await OrdersRepository.answerAdditionalQuote(Number(choice.quote.id), true);
        if (!res.success) throw new Error(res.message);
      } else if (choice.kind === 'cancel') {
        const res = await OrdersRepository.cancelOrder(orderId, 'Cancelled from the app');
        if (!res.success) throw new Error(res.message);
      }
      // Re-read rather than guessing: the server decides the resulting status,
      // and it refuses some of these outright.
      await reload();
    } catch (e: any) {
      Alert.alert('Could not do that', e?.message ?? 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  /** Declining a mid-job charge — the screen only ever offered accepting. */
  const rejectAdditionalQuote = async (quote: AdditionalQuote) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await OrdersRepository.answerAdditionalQuote(Number(quote.id), false);
      if (!res.success) throw new Error(res.message);
      await reload();
    } catch (e: any) {
      Alert.alert('Could not do that', e?.message ?? 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const canShowCancel = order.status === 'pending' || order.status === 'quoted' || order.status === 'confirmed';

  return (
    <View style={styles.screen}>
      <StatusBar barStyle='dark-content' backgroundColor={AppColors.white} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
