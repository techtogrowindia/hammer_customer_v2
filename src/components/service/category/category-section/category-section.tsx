import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { GCCategory, GCSubCategory } from '@/domain/models/service-categories/getCategoriesResponse';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronUp } from 'lucide-react-native';
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
        onPressIn={() => (scale.value = withSpring(0.92, { damping: 14, stiffness: 260 }))}
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
        <LinearGradient
          colors={[PRIMARY, PRIMARY_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerAccent}
        />
        <View>
          <Text style={styles.headerTitle}>{category.name}</Text>
          <Text style={styles.headerSubtitle}>
            {subcategories.length} {subcategories.length === 1 ? 'service' : 'services'}
          </Text>
        </View>
      </View>

      <Animated.View layout={LinearTransition.duration(280)} style={styles.grid}>
        {visible.map((sub) => (
          <Animated.View key={sub.id} entering={FadeIn.duration(220)} style={styles.gridItem}>
            <Tile onPress={() => onSelectSubcategory(sub)}>
              <View style={styles.imageRing}>
                <View style={styles.imageWrapper}>
                  {sub.image ? (
                    <Image source={{ uri: sub.image }} style={styles.image} />
                  ) : (
                    <View style={[styles.image, styles.imageFallback]} />
                  )}
                </View>
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
              <View style={styles.moreRing}>
                <LinearGradient
                  colors={[PRIMARY, PRIMARY_DARK]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.moreCircle}
                >
                  <Text style={styles.moreCount}>+{subcategories.length - (MAX_VISIBLE - 1)}</Text>
                </LinearGradient>
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
          style={({ pressed }) => [styles.collapsePill, pressed && { opacity: 0.75 }]}
        >
          <Text style={styles.collapseLabel}>Show less</Text>
          <ChevronUp size={14} color={PRIMARY_DARK} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 14,
    marginTop: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    shadowColor: PRIMARY_DARK,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.035)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 16,
    gap: 10,
  },
  headerAccent: {
    width: 5,
    height: 28,
    borderRadius: 3,
  },
  headerTitle: {
    fontFamily: font.bold,
    fontSize: 16,
    color: AppColors.textPrimary,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontFamily: font.regular,
    fontSize: 11.5,
    color: AppColors.textTertiary,
    marginTop: 1,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '25%', alignItems: 'center', paddingVertical: 8 },
  itemInner: { alignItems: 'center' },
  imageRing: {
    width: 54,
    height: 54,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(244,167,3,0.25)',
  },
  imageWrapper: {
    width: 46,
    height: 46,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: AppColors.warningLight,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: '100%', height: '100%' },
  imageFallback: { backgroundColor: AppColors.warningLight },
  label: {
    marginTop: 8,
    fontFamily: font.medium,
    fontSize: 11,
    color: AppColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 2,
    lineHeight: 14,
  },
  moreRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(244,167,3,0.25)',
  },
  moreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_DARK,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  moreCount: {
    fontFamily: font.bold,
    fontSize: 14,
    color: '#fff',
    letterSpacing: -0.2,
  },
  collapsePill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(244,167,3,0.1)',
  },
  collapseLabel: {
    fontFamily: font.semiBold,
    fontSize: 12,
    color: PRIMARY_DARK,
  },
});
