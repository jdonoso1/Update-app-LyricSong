import { TrendingUp, Search, Clock, Music, Library } from "lucide-react";
import { SongCard } from "./SongCard";
import { mockSongs } from "../data/mockSongs";
import { trendingWords, popularSearches } from "../data/mockData";
import { getRecentlyListened, getCreatedCollections } from "../utils/storage";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

export function ExplorePage() {
  const navigate = useNavigate();
  const recentlyListenedIds = getRecentlyListened();
  const recentlyListened = mockSongs.filter((s) => recentlyListenedIds.includes(s.id));
  
  // Mock recommended content
  const recommendedSongs = mockSongs.slice(0, 6);
  const recommendedCollections = [
    { id: "rec1", name: "French Travel Essentials", songs: 24, creator: "Marie D.", isOwned: false },
    { id: "rec2", name: "Spanish Love Songs", songs: 18, creator: "Carlos M.", isOwned: false },
    { id: "rec3", name: "Daily French Vocabulary", songs: 32, creator: "Jean L.", isOwned: false },
  ];

  const handleSearchWord = (word: string) => {
    navigate(`/?q=${encodeURIComponent(word)}`);
  };

  const handleSearchQuery = (query: string) => {
    navigate(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Explore</h1>
        <p className="text-sm text-gray-600">
          Discover new songs, trending words, and popular collections
        </p>
      </div>

      <div className="space-y-8">
        {/* Trending Words */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Trending Words</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {trendingWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleSearchWord(word.word)}
                className="group flex items-center justify-between rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg">{word.word}</p>
                  <p className="text-xs text-gray-600">{word.language}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">
                    {word.searchCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">searches</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Searches */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Search className="size-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Popular Searches</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearchQuery(search.query)}
                className="flex flex-col items-start rounded-lg border bg-white p-3 text-left shadow-sm transition-all hover:shadow-md"
              >
                <p className="mb-1 font-medium text-sm">{search.query}</p>
                <p className="text-xs text-gray-500">{search.count.toLocaleString()} searches</p>
              </button>
            ))}
          </div>
        </section>

        {/* Recommended Songs */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Music className="size-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Recommended Songs</h2>
          </div>

          <div className="space-y-3">
            {recommendedSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>

        {/* Recommended Collections */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Library className="size-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Recommended Collections</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {recommendedCollections.map((collection) => (
              <div
                key={collection.id}
                className="flex flex-col rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="mb-3">
                  <h3 className="font-semibold">{collection.name}</h3>
                  <p className="mt-1 text-xs text-gray-600">by {collection.creator}</p>
                </div>

                <div className="mb-3 text-sm text-gray-500">
                  {collection.songs} songs
                </div>

                <Button variant="outline" size="sm" className="gap-2">
                  <Library className="size-4" />
                  Save Collection
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Listened */}
        {recentlyListened.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Clock className="size-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Recently Listened</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {recentlyListened.slice(0, 6).map((song) => (
                <div key={song.id} className="flex gap-3 rounded-lg border bg-white p-3">
                  <img
                    src={song.albumArt}
                    alt={song.title}
                    className="size-16 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">{song.title}</p>
                    <p className="truncate text-xs text-gray-600">{song.artist}</p>
                    <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {song.language}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
