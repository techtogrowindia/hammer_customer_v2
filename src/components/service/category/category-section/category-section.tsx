import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { GCCategory, GCSubCategory } from '@/domain/models/service-categories/getCategoriesResponse';
import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const NUM_COLUMNS = 4;
const MAX_ROWS_COLLAPSED = 2;
const MAX_VISIBLE = NUM_COLUMNS * MAX_ROWS_COLLAPSED; // 8

const font = {
  regular: fontTokens.fontFamily.regular,
  medium: fontTokens.fontFamily.medium,
  semiBold: 'Poppins_600SemiBold',
  bold: fontTokens.fontFamily.bold,
};

const PRIMARY = AppColors.primary;
const PRIMARY_DARK = AppColors.primaryDark ?? AppColors.primary;

/* ---------- individual tile, isolated so it can hold its own press animation ---------- */

function Tile({ onPress, children }: { onPress: () => void; children: React.ReactNode }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole='button'
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.95, { damping: 14, stiffness: 260 }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 14, stiffness: 260 }))}
        style={styles.itemInner}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

interface CategorySectionProps {
  category: GCCategory;
  onSelectSubcategory: (sub: GCSubCategory) => void;
}

export function CategorySection({ category, onSelectSubcategory }: CategorySectionProps) {
  const subcategories = category.subcategories ?? [];
  const hasOverflow = subcategories.length > MAX_VISIBLE;
  const [expanded, setExpanded] = useState(false);

  if (subcategories.length === 0) return null;

  const visible = expanded || !hasOverflow ? subcategories : subcategories.slice(0, MAX_VISIBLE - 1);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{subcategories.length}</Text>
        </View>
      </View>

      <Animated.View layout={LinearTransition.duration(280)} style={styles.grid}>
        {visible.map((sub) => (
          <Animated.View key={sub.id} entering={FadeIn.duration(220)} style={styles.gridItem}>
            <Tile onPress={() => onSelectSubcategory(sub)}>
              <View style={styles.tileBox}>
                {sub.image ? (
                  <Image source={{ uri: sub.image }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.imageFallback]} />
                )}
              </View>
              <Text style={styles.label} numberOfLines={2}>
                {sub.name}
              </Text>
            </Tile>
          </Animated.View>
        ))}

        {hasOverflow && !expanded && (
          <Animated.View entering={FadeIn.duration(220)} style={styles.gridItem}>
            <Tile onPress={() => setExpanded(true)}>
              <View style={[styles.tileBox, styles.moreBox]}>
                <Text style={styles.moreCount}>+{subcategories.length - (MAX_VISIBLE - 1)}</Text>
              </View>
              <Text style={styles.label} numberOfLines={2}>
                See more
              </Text>
            </Tile>
          </Animated.View>
        )}
      </Animated.View>

      {hasOverflow && expanded && (
        <Pressable
          onPress={() => setExpanded(false)}
          accessibilityRole='button'
          style={({ pressed }) => [styles.collapseRow, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.collapseLabel}>Show less</Text>
          <ChevronDown size={14} color={AppColors.textTertiary} style={{ transform: [{ rotate: '180deg' }] }} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 14,
  },
  headerTitle: {
    fontFamily: font.bold,
    fontSize: 15.5,
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  countBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: 'rgba(244,167,3,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontFamily: font.semiBold,
    fontSize: 11,
    color: PRIMARY_DARK,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '25%', alignItems: 'center', paddingVertical: 8 },
  itemInner: { alignItems: 'center' },

  /* flat outlined tile: no shadow, thin border, tinted fill — icon sits on a quiet card */
  tileBox: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: 'rgba(244,167,3,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244,167,3,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '78%', height: '78%', borderRadius: 50 },
  imageFallback: { backgroundColor: 'rgba(0,0,0,0.04)' },
  label: {
    marginTop: 7,
    fontFamily: font.medium,
    fontSize: 11,
    color: AppColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 2,
    lineHeight: 14,
  },
  moreBox: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.18)',
  },
  moreCount: {
    fontFamily: font.bold,
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  collapseRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingVertical: 6,
  },
  collapseLabel: {
    fontFamily: font.medium,
    fontSize: 12,
    color: AppColors.textTertiary,
  },
});
