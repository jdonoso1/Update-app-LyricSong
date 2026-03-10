import { Song } from "../data/mockSongs";

export interface SavedSearch {
  id: string;
  query: string;
  filters: {
    language?: string;
    genre?: string;
    artist?: string;
    searchIn?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  timestamp: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: {
    language?: string;
    genre?: string;
    artist?: string;
    searchIn?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  timestamp: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  songIds: string[];
  createdAt: string;
  isOwned: boolean; // true for created, false for saved from others
}

// Local storage keys
const SAVED_SONGS_KEY = "lyricLearn_savedSongs";
const SAVED_SEARCHES_KEY = "lyricLearn_savedSearches";
const SEARCH_HISTORY_KEY = "lyricLearn_searchHistory";
const COLLECTIONS_KEY = "lyricLearn_collections";
const FOLLOWED_USERS_KEY = "lyricLearn_followedUsers";
const RECENTLY_LISTENED_KEY = "lyricLearn_recentlyListened";

// Saved Songs
export const getSavedSongs = (): string[] => {
  const saved = localStorage.getItem(SAVED_SONGS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveSong = (songId: string): void => {
  const saved = getSavedSongs();
  if (!saved.includes(songId)) {
    localStorage.setItem(SAVED_SONGS_KEY, JSON.stringify([...saved, songId]));
  }
};

export const unsaveSong = (songId: string): void => {
  const saved = getSavedSongs();
  localStorage.setItem(
    SAVED_SONGS_KEY,
    JSON.stringify(saved.filter((id) => id !== songId))
  );
};

export const isSongSaved = (songId: string): boolean => {
  return getSavedSongs().includes(songId);
};

// Saved Searches (intentionally saved by user)
export const getSavedSearches = (): SavedSearch[] => {
  const saved = localStorage.getItem(SAVED_SEARCHES_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveSearch = (search: Omit<SavedSearch, "id" | "timestamp">): void => {
  const searches = getSavedSearches();
  const newSearch: SavedSearch = {
    ...search,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(
    SAVED_SEARCHES_KEY,
    JSON.stringify([newSearch, ...searches])
  );
};

export const deleteSavedSearch = (searchId: string): void => {
  const searches = getSavedSearches();
  localStorage.setItem(
    SAVED_SEARCHES_KEY,
    JSON.stringify(searches.filter((s) => s.id !== searchId))
  );
};

// Search History (automatically recorded)
export const getSearchHistory = (): SearchHistoryItem[] => {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const addToSearchHistory = (
  search: Omit<SearchHistoryItem, "id" | "timestamp">
): void => {
  const history = getSearchHistory();
  const newItem: SearchHistoryItem = {
    ...search,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  // Keep only last 50 searches
  const updated = [newItem, ...history].slice(0, 50);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
};

export const clearSearchHistory = (): void => {
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([]));
};

export const deleteSearchHistoryItem = (itemId: string): void => {
  const history = getSearchHistory();
  localStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(history.filter((h) => h.id !== itemId))
  );
};

// Collections
export const getCollections = (): Collection[] => {
  const collections = localStorage.getItem(COLLECTIONS_KEY);
  return collections ? JSON.parse(collections) : [];
};

export const getCreatedCollections = (): Collection[] => {
  return getCollections().filter((c) => c.isOwned);
};

export const getSavedCollections = (): Collection[] => {
  return getCollections().filter((c) => !c.isOwned);
};

export const createCollection = (
  collection: Omit<Collection, "id" | "createdAt">
): Collection => {
  const collections = getCollections();
  const newCollection: Collection = {
    ...collection,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(
    COLLECTIONS_KEY,
    JSON.stringify([...collections, newCollection])
  );
  return newCollection;
};

export const updateCollection = (
  collectionId: string,
  updates: Partial<Collection>
): void => {
  const collections = getCollections();
  const updated = collections.map((c) =>
    c.id === collectionId ? { ...c, ...updates } : c
  );
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
};

export const deleteCollection = (collectionId: string): void => {
  const collections = getCollections();
  localStorage.setItem(
    COLLECTIONS_KEY,
    JSON.stringify(collections.filter((c) => c.id !== collectionId))
  );
};

export const addSongToCollection = (collectionId: string, songId: string): void => {
  const collections = getCollections();
  const updated = collections.map((c) => {
    if (c.id === collectionId && !c.songIds.includes(songId)) {
      return { ...c, songIds: [...c.songIds, songId] };
    }
    return c;
  });
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
};

export const removeSongFromCollection = (
  collectionId: string,
  songId: string
): void => {
  const collections = getCollections();
  const updated = collections.map((c) => {
    if (c.id === collectionId) {
      return { ...c, songIds: c.songIds.filter((id) => id !== songId) };
    }
    return c;
  });
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
};

// Followed Users (mock data for now)
export const getFollowedUsers = (): string[] => {
  const followed = localStorage.getItem(FOLLOWED_USERS_KEY);
  return followed ? JSON.parse(followed) : [];
};

export const followUser = (userId: string): void => {
  const followed = getFollowedUsers();
  if (!followed.includes(userId)) {
    localStorage.setItem(
      FOLLOWED_USERS_KEY,
      JSON.stringify([...followed, userId])
    );
  }
};

export const unfollowUser = (userId: string): void => {
  const followed = getFollowedUsers();
  localStorage.setItem(
    FOLLOWED_USERS_KEY,
    JSON.stringify(followed.filter((id) => id !== userId))
  );
};

// Recently Listened
export const getRecentlyListened = (): string[] => {
  const recent = localStorage.getItem(RECENTLY_LISTENED_KEY);
  return recent ? JSON.parse(recent) : [];
};

export const addToRecentlyListened = (songId: string): void => {
  const recent = getRecentlyListened();
  const updated = [songId, ...recent.filter((id) => id !== songId)].slice(0, 20);
  localStorage.setItem(RECENTLY_LISTENED_KEY, JSON.stringify(updated));
};
