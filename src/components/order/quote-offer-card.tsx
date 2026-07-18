import { AppColors } from '@/core/theme/app-colors';
import { Check, ChevronDown, ChevronUp, Star } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { styles } from './styles';
import { TechnicianBadgeRow } from './technician-badge-row';
import { QuoteOffer } from './types';

export function QuoteOfferCard({
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
