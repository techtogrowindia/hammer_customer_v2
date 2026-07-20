// components/search/SearchHeader.tsx
import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useBoundStore } from '@/store/boundStore';
import { router } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderAction {
  icon: React.ReactNode;
  onPress: () => void;
}

interface SearchHeaderProps {
  mode?: 'link' | 'input';
  placeholder?: string;
  autoFocus?: boolean;
  backgroundColor?: string;
  rightActions?: HeaderAction[];
}

const font = {
  regular: fontTokens.fontFamily.regular,
};

export function SearchHeader({
  mode = 'input',
  placeholder = 'Search for a service',
  autoFocus = false,
  backgroundColor = AppColors.primary,
  rightActions = [],
}: SearchHeaderProps) {
  const { top } = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const searchQuery = useBoundStore((s) => s.searchQuery);
  const setSearchQuery = useBoundStore((s) => s.setSearchQuery);
  const clearSearchQuery = useBoundStore((s) => s.clearSearchQuery);
  const submitSearch = useBoundStore((s) => s.submitSearch);

  const handleClear = () => {
    clearSearchQuery();
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: top + 12 }]}>
      <View style={styles.decor} />

      <View style={styles.row}>
        {mode === 'input' && (
          <Pressable
            accessibilityRole='button'
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}
          >
            <ArrowLeft size={19} color={AppColors.white} strokeWidth={2.25} />
          </Pressable>
        )}

        {mode === 'input' ? (
          <View style={styles.searchBar}>
            <Search size={18} color={AppColors.textSecondary} strokeWidth={2} />
            <TextInput
              ref={inputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => submitSearch()}
              placeholder={placeholder}
              placeholderTextColor={AppColors.textSecondary}
              style={styles.input}
              returnKeyType='search'
              autoCapitalize='none'
              autoCorrect={false}
              autoFocus={autoFocus}
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={handleClear}
                hitSlop={10}
                accessibilityRole='button'
                accessibilityLabel='Clear search'
              >
                <X size={18} color={AppColors.textSecondary} />
              </Pressable>
            )}
          </View>
        ) : (
          <Pressable
            accessibilityRole='button'
            onPress={() => router.push('/(tabs)/(home)/search')}
            style={({ pressed }) => [styles.searchBar, styles.searchBarLink, pressed && styles.searchBarLinkPressed]}
          >
            <Search size={17} color={AppColors.textTertiary} strokeWidth={2} />
            <Text numberOfLines={1} style={styles.placeholderText}>
              {placeholder}
            </Text>
          </Pressable>
        )}

        <View style={styles.actions}>
          {rightActions.map((action, index) => (
            <Pressable
              key={index}
              accessibilityRole='button'
              hitSlop={8}
              onPress={action.onPress}
              style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}
            >
              {action.icon}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const BAR_HEIGHT = 44;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 14, overflow: 'hidden' },
  decor: { position: 'absolute', width: 220, height: 220, borderRadius: 110, top: -90, right: -60 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: BAR_HEIGHT,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: AppColors.white,
  },
  searchBarLink: {
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  searchBarLinkPressed: { backgroundColor: AppColors.warningLight },
  input: { flex: 1, fontFamily: font.regular, fontSize: 14, color: AppColors.textPrimary, padding: 0 },
  placeholderText: { flex: 1, fontFamily: font.regular, fontSize: 13, color: AppColors.textTertiary },
  actions: { flexDirection: 'row', gap: 10 },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  iconPressed: { opacity: 0.75 },
});

export default SearchHeader;
