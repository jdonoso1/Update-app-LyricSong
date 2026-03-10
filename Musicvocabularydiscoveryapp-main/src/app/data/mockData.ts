// Mock data for explore page features

export interface TrendingWord {
  word: string;
  searchCount: number;
  language: string;
}

export interface PopularSearch {
  query: string;
  count: number;
}

export const trendingWords: TrendingWord[] = [
  { word: "volar", searchCount: 1523, language: "Spanish" },
  { word: "amor", searchCount: 1489, language: "Spanish" },
  { word: "rêver", searchCount: 1245, language: "French" },
  { word: "lumière", searchCount: 1103, language: "French" },
  { word: "corazón", searchCount: 987, language: "Spanish" },
  { word: "liberté", searchCount: 876, language: "French" },
  { word: "noche", searchCount: 754, language: "Spanish" },
  { word: "océan", searchCount: 623, language: "French" },
];

export const popularSearches: PopularSearch[] = [
  { query: "travel words", count: 2341 },
  { query: "romantic phrases", count: 1987 },
  { query: "daily vocabulary", count: 1654 },
  { query: "nature words", count: 1432 },
  { query: "emotions", count: 1289 },
];

export const mockArtists = [
  "Álvaro Soler",
  "María González",
  "Carlos Vega",
  "Diego Rivera",
  "Ana Flores",
  "Pablo Morales",
  "Roberto Sánchez",
  "Claire Dubois",
  "Antoine Martin",
  "Sophie Bernard",
  "Camille Petit",
  "Lucas Rousseau",
  "Emma Laurent",
  "Julie Moreau",
];
