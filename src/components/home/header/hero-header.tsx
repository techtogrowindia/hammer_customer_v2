import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { Bell, MapPin, Search } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HeroHeaderProps {
  topInset: number;
  userInitial: string;
  locationLabel: string;
  greeting: string;
  searchPlaceholder: string;
  onAvatarPress?: () => void;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  onFilterPress?: () => void;
  hasUnreadNotification?: boolean;
}

/**
 * A more compact hero where the search bar is its own elevated card that
 * straddles the boundary between the colored hero and the white body below —
 * rather than living fully inside the hero. Greeting + avatar sit up top,
 * location is a standalone pill, and there's an optional filter button
 * docked to the search card.
 */
export function HeroHeader({
  topInset,
  userInitial,
  locationLabel,
  greeting,
  searchPlaceholder,
  onAvatarPress,
  onLocationPress,
  onNotificationPress,
  onSearchPress,
  onFilterPress,
  hasUnreadNotification = true,
}: HeroHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.hero, { paddingTop: topInset + 14 }]}>
        <View style={styles.heroDecor} />

        <View style={styles.topRow}>
          <Pressable accessibilityRole='button' onPress={onAvatarPress} style={styles.avatar} hitSlop={4}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </Pressable>

          <View style={styles.greetingWrap}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Pressable accessibilityRole='button' onPress={onLocationPress} style={styles.locationPill} hitSlop={6}>
              <MapPin size={11} color={AppColors.primary} strokeWidth={2.25} />
              <Text style={styles.locationText} numberOfLines={1}>
                {locationLabel}
              </Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole='button'
            onPress={onNotificationPress}
            style={({ pressed }) => [styles.bellButton, pressed && { opacity: 0.8 }]}
            hitSlop={8}
          >
            <Bell size={18} color={AppColors.secondary} strokeWidth={2} />
            {hasUnreadNotification && <View style={styles.bellDot} />}
          </Pressable>
        </View>
      </View>

      {/* Floating search card — overlaps hero + body */}
      <View style={styles.searchCardWrap}>
        <Pressable
          accessibilityRole='button'
          onPress={onSearchPress}
          style={({ pressed }) => [styles.searchCard, pressed && styles.searchCardPressed]}
        >
          <Search size={17} color={AppColors.textTertiary} strokeWidth={2} />
          <Text style={styles.searchPlaceholder} numberOfLines={1}>
            {searchPlaceholder}
          </Text>
          {/* <View style={styles.divider} />
          <Pressable
            accessibilityRole='button'
            onPress={onFilterPress}
            hitSlop={8}
            style={({ pressed }) => [styles.filterButton, pressed && { opacity: 0.7 }]}
          >
            <SlidersHorizontal size={15} color={AppColors.primary} strokeWidth={2.25} />
          </Pressable> */}
        </Pressable>
      </View>
    </View>
  );
}

const SEARCH_CARD_HEIGHT = 56;

const styles = StyleSheet.create({
  wrap: { marginBottom: SEARCH_CARD_HEIGHT / 2 + 8 },
  hero: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingBottom: SEARCH_CARD_HEIGHT / 2 + 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -70,
    right: -50,
    // backgroundColor: 'rgba(255,255,255,0.08)',
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${AppColors.textPrimary}10`,
    borderWidth: 1.5,
    borderColor: `${AppColors.textPrimary}35`,
  },
  avatarText: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: AppColors.textPrimary },
  greetingWrap: { flex: 1 },
  greeting: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: AppColors.textPrimary, marginBottom: 5 },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
    backgroundColor: AppColors.secondary,
    maxWidth: '90%',
  },
  locationText: { fontFamily: fontTokens.fontFamily.medium, fontSize: 11, color: AppColors.white },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AppColors.error,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },

  // Floating card
  searchCardWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: -SEARCH_CARD_HEIGHT / 2,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: SEARCH_CARD_HEIGHT,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: AppColors.white,
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  searchCardPressed: { backgroundColor: AppColors.warningLight },
  searchPlaceholder: {
    flex: 1,
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 13,
    color: AppColors.textTertiary,
  },
  divider: { width: 1, height: 22, backgroundColor: AppColors.divider },
  filterButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.warningLight,
  },
});

export default HeroHeader;

// import { AppColors } from '@/core/theme/app-colors';
// import { fontTokens } from '@/core/theme/typography';
// import { Bell, ChevronDown, MapPin, Search } from 'lucide-react-native';
// import React from 'react';
// import { Pressable, StyleSheet, Text, View } from 'react-native';

// interface HeroHeaderProps {
//   topInset: number;
//   userInitial: string;
//   locationLabel: string;
//   greeting: string;
//   searchPlaceholder: string;
//   onAvatarPress?: () => void;
//   onLocationPress?: () => void;
//   onNotificationPress?: () => void;
//   onSearchPress?: () => void;
//   onFilterPress?: () => void;
//   hasUnreadNotification?: boolean;
// }

// /**
//  * No colored hero block at all — everything sits on the white background.
//  * Row 1: avatar + greeting + bell. Row 2: a location chip and the search
//  * bar share the same row (chip is auto-width, search flexes to fill),
//  * instead of one stacked above/inside the other. A hairline divider marks
//  * the header/body boundary rather than a color change or shadow.
//  */
// export function HeroHeader({
//   topInset,
//   userInitial,
//   locationLabel,
//   greeting,
//   searchPlaceholder,
//   onAvatarPress,
//   onLocationPress,
//   onNotificationPress,
//   onSearchPress,
//   onFilterPress,
//   hasUnreadNotification = true,
// }: HeroHeaderProps) {
//   return (
//     <View style={[styles.wrap, { paddingTop: topInset + 12 }]}>
//       <View style={styles.topRow}>
//         <Pressable accessibilityRole='button' onPress={onAvatarPress} style={styles.avatar} hitSlop={4}>
//           <Text style={styles.avatarText}>{userInitial}</Text>
//         </Pressable>

//         <Text style={styles.greeting} numberOfLines={1}>
//           {greeting}
//         </Text>

//         <Pressable
//           accessibilityRole='button'
//           onPress={onNotificationPress}
//           style={({ pressed }) => [styles.bellButton, pressed && { backgroundColor: AppColors.warningLight }]}
//           hitSlop={8}
//         >
//           <Bell size={18} color={AppColors.textPrimary} strokeWidth={2} />
//           {hasUnreadNotification && <View style={styles.bellDot} />}
//         </Pressable>
//       </View>

//       <View style={styles.searchRow}>
//         <Pressable
//           accessibilityRole='button'
//           onPress={onLocationPress}
//           style={({ pressed }) => [styles.locationChip, pressed && { backgroundColor: AppColors.warningLight }]}
//           hitSlop={4}
//         >
//           <MapPin size={13} color={AppColors.primary} strokeWidth={2.25} />
//           <Text style={styles.locationText} numberOfLines={1}>
//             {locationLabel}
//           </Text>
//           <ChevronDown size={13} color={AppColors.textTertiary} strokeWidth={2.25} />
//         </Pressable>

//         <Pressable
//           accessibilityRole='button'
//           onPress={onSearchPress}
//           style={({ pressed }) => [styles.searchBar, pressed && { borderColor: AppColors.primary }]}
//         >
//           <Search size={16} color={AppColors.textTertiary} strokeWidth={2} />
//           <Text style={styles.searchPlaceholder} numberOfLines={1}>
//             {searchPlaceholder}
//           </Text>
//         </Pressable>

//         {/* <Pressable
//           accessibilityRole='button'
//           onPress={onFilterPress}
//           hitSlop={4}
//           style={({ pressed }) => [styles.filterButton, pressed && { backgroundColor: AppColors.warningLight }]}
//         >
//           <SlidersHorizontal size={16} color={AppColors.primary} strokeWidth={2.25} />
//         </Pressable> */}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: {
//     backgroundColor: AppColors.white,
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: AppColors.divider,
//   },
//   topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: AppColors.warningLight,
//   },
//   avatarText: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: AppColors.primary },
//   greeting: { flex: 1, fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: AppColors.textPrimary },
//   bellButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   bellDot: {
//     position: 'absolute',
//     top: 7,
//     right: 7,
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: AppColors.error,
//     borderWidth: 1.5,
//     borderColor: AppColors.white,
//   },

//   searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   locationChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//     height: 42,
//     maxWidth: 108,
//     paddingHorizontal: 10,
//     borderRadius: 13,
//     backgroundColor: AppColors.warningLight,
//   },
//   locationText: {
//     fontFamily: fontTokens.fontFamily.medium,
//     fontSize: 11,
//     color: AppColors.textPrimary,
//     flexShrink: 1,
//   },
//   searchBar: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     height: 42,
//     borderRadius: 13,
//     paddingHorizontal: 12,
//     borderWidth: 1.5,
//     borderColor: AppColors.divider,
//   },
//   searchPlaceholder: {
//     flex: 1,
//     fontFamily: fontTokens.fontFamily.regular,
//     fontSize: 12,
//     color: AppColors.textTertiary,
//   },
//   filterButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 13,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: AppColors.warningLight,
//   },
// });

// export default HeroHeader;
