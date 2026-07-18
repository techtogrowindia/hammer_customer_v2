import { AppColors } from '@/core/theme/app-colors';
import { CheckCircle2, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from './styles';

export function ReviewCard({ onSubmit }: { onSubmit: (rating: number, comment: string) => void }) {
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
