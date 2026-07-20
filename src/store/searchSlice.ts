import type { StateCreator } from 'zustand';

const MAX_RECENT = 8;

export interface searchSliceType {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearSearchQuery: () => void;
  recentSearches: string[];
  addRecentSearch: (term: string, max?: number) => void;
  clearRecentSearches: () => void;
  submitSearch: (term?: string) => void;
}

export const createSearchSlice: StateCreator<searchSliceType> = (set, get) => ({
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearSearchQuery: () => set({ searchQuery: '' }),

  recentSearches: [],
  addRecentSearch: (term, max = MAX_RECENT) =>
    set((state) => ({
      recentSearches: [term, ...state.recentSearches.filter((t) => t !== term)].slice(0, max),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),

  submitSearch: (term) => {
    const value = (term ?? get().searchQuery).trim();
  },
});
