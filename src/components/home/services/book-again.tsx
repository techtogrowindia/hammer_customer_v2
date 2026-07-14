import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { RotateCcw } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '../header/section-header';
import { BookAgainItem } from '../home.types';

interface BookAgainListProps {
  items: BookAgainItem[];
  onSeeAll?: () => void;
  onRebook: (id: string) => void;
  title?: string;
  actionLabel?: string;
}

export function BookAgainList({
  items,
  onSeeAll,
  onRebook,
  title = 'Book Again',
  actionLabel = 'History',
}: BookAgainListProps) {
  if (items.length === 0) return null;

  return (
    <>
      <SectionHeader title={title} actionLabel={actionLabel} onActionPress={onSeeAll} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.imageBanner}>
              <Image
                source={{
                  uri: `https://picsum.photos/300/200?random=${item.id}`,
                }}
                style={styles.image}
                resizeMode='cover'
              />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>

              <Text style={styles.date} numberOfLines={1}>
                {item.lastDate}
              </Text>
            </View>

            <Pressable
              onPress={() => onRebook(item.id)}
              style={({ pressed }) => [
                styles.rebookBtn,
                pressed && {
                  backgroundColor: AppColors.primaryDark,
                },
              ]}
            >
              <RotateCcw size={12} color={AppColors.white} strokeWidth={2.25} />
              <Text style={styles.rebookBtnText}>Rebook</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 12,
    paddingBottom: 28,
  },

  card: {
    width: 160,
    borderRadius: 18,
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.divider,
    overflow: 'hidden',
  },

  imageBanner: {
    height: 90,
    backgroundColor: AppColors.warningLight,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  textWrap: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },

  name: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: AppColors.textPrimary,
  },

  date: {
    marginTop: 4,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 10,
    color: AppColors.textSecondary,
  },

  rebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    backgroundColor: AppColors.primary,
  },

  rebookBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: AppColors.white,
  },
});

export default BookAgainList;
