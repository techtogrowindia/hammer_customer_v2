import { AppColors } from '@/core/theme/app-colors';
import { fontTokens } from '@/core/theme/typography';
import { useBoundStore } from '@/store/boundStore';
import { useRouter } from 'expo-router';
import { Clock, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const DEBOUNCE_MS = 300;
const TRENDING_SERVICES = ['AC repair', 'Deep cleaning', 'Plumber', 'Electrician', 'Salon at home', 'Pest control'];

export default function SearchScreen() {
  const router = useRouter();

  const searchQuery = useBoundStore((s) => s.searchQuery);
  const recentSearches = useBoundStore((s) => s.recentSearches) ?? [];
  const clearRecentSearches = useBoundStore((s) => s.clearRecentSearches);
  const submitSearch = useBoundStore((s) => s.submitSearch);

  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;
    async function runSearch() {
      if (!debouncedQuery) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const data = await mockSearchServices(debouncedQuery);
        if (!cancelled) setResults(data);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }
    runSearch();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const showSuggestions = debouncedQuery.length === 0;

  return (
    <View style={styles.container}>
      {showSuggestions ? (
        <SuggestionsView
          recentSearches={recentSearches}
          onClearRecent={clearRecentSearches}
          onSelectTerm={submitSearch}
        />
      ) : (
        <ResultsView
          query={debouncedQuery}
          isSearching={isSearching}
          results={results}
          onSelectResult={(item) => router.push({ pathname: '/service/[id]', params: { id: item.id } })}
        />
      )}
    </View>
  );
}

function SuggestionsView({ recentSearches, onClearRecent, onSelectTerm }) {
  return (
    <FlatList
      data={[]}
      keyExtractor={() => 'x'}
      ListHeaderComponent={
        <View>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Recent searches</Text>
                <Pressable onPress={onClearRecent} hitSlop={8}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              </View>
              {recentSearches.map((term) => (
                <Pressable key={term} style={styles.rowItem} onPress={() => onSelectTerm(term)}>
                  <Clock size={16} color={AppColors.textSecondary} />
                  <Text style={styles.rowItemText}>{term}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Trending</Text>
            </View>
            <View style={styles.chipWrap}>
              {TRENDING_SERVICES.map((term) => (
                <Pressable key={term} style={styles.chip} onPress={() => onSelectTerm(term)}>
                  <TrendingUp size={14} color={AppColors.primary} />
                  <Text style={styles.chipText}>{term}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      }
      renderItem={null}
    />
  );
}

function ResultsView({ query, isSearching, results, onSelectResult }) {
  if (isSearching) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator color={AppColors.primary} />
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.emptyTitle}>No results for "{query}"</Text>
        <Text style={styles.emptySubtitle}>Try a different keyword or check the spelling.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.resultsList}
      renderItem={({ item }) => (
        <Pressable style={styles.resultRow} onPress={() => onSelectResult(item)}>
          <View style={styles.resultThumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultSubtitle}>{item.category}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

async function mockSearchServices(q) {
  await new Promise((r) => setTimeout(r, 350));
  const all = [
    { id: '1', title: 'AC Repair & Service', category: 'Appliance' },
    { id: '2', title: 'Full Home Deep Cleaning', category: 'Cleaning' },
    { id: '3', title: 'Bathroom Plumbing Fix', category: 'Plumbing' },
    { id: '4', title: 'Switchboard Repair', category: 'Electrical' },
    { id: '5', title: "Women's Salon at Home", category: 'Salon' },
  ];
  return all.filter((item) => item.title.toLowerCase().includes(q.toLowerCase()));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontFamily: fontTokens.fontFamily.bold, fontSize: 14, color: AppColors.textPrimary },
  clearText: { fontFamily: fontTokens.fontFamily.medium, fontSize: 13, color: AppColors.primary },
  rowItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  rowItemText: { fontFamily: fontTokens.fontFamily.regular, fontSize: 14, color: AppColors.textPrimary },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipText: { fontFamily: fontTokens.fontFamily.medium, fontSize: 13, color: AppColors.textPrimary },
  resultsList: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border ?? '#eee',
  },
  resultThumb: { width: 48, height: 48, borderRadius: 8, backgroundColor: AppColors.surface },
  resultTitle: { fontFamily: fontTokens.fontFamily.medium, fontSize: 14, color: AppColors.textPrimary },
  resultSubtitle: {
    fontFamily: fontTokens.fontFamily.regular,
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingTop: 60 },
  emptyTitle: {
    fontFamily: fontTokens.fontFamily.bold,
    fontSize: 15,
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: fontTokens.fontFamily.medium,
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
});
