import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Bookmark, X, ArrowUpDown, Library, Compass, FolderOpen } from "lucide-react";
// Import breadcrumb UI components to display navigation hierarchy on the results page.
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { useSearchParams, Link } from "react-router";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SongCard } from "./SongCard";
import { mockSongs, Song } from "../data/mockSongs";
import { mockArtists } from "../data/mockData";
import { saveSearch, addToSearchHistory, getSavedSongs, getCreatedCollections, Collection } from "../utils/storage";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type SortOption = "alphabetical" | "newest" | "relevance" | "mostListened";

export function HomePage() {
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<string>("all");
  const [genre, setGenre] = useState<string>("all");
  const [artist, setArtist] = useState<string>("all");
  const [searchIn, setSearchIn] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  // When a search is initiated we set this flag to true and clear it after a
  // brief delay.  This allows us to show a loading state ("Searching songs…")
  // before rendering the results, satisfying the assignment's requirement
  // around system state feedback.  Without this flag the results would
  // immediately render and the loading message would not be visible.
  const [isSearching, setIsSearching] = useState(false);

  // Load search from URL parameters
  useEffect(() => {
    const query = searchParams.get("q");
    const lang = searchParams.get("lang");
    const genreParam = searchParams.get("genre");
    const artistParam = searchParams.get("artist");
    const searchInParam = searchParams.get("in");
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    if (query) {
      setSearchQuery(query);
      setHasSearched(true);
    }
    if (lang) setLanguage(lang);
    if (genreParam) setGenre(genreParam);
    if (artistParam) setArtist(artistParam);
    if (searchInParam) setSearchIn(searchInParam);
    if (fromParam) setDateFrom(fromParam);
    if (toParam) setDateTo(toParam);
  }, [searchParams]);

  // Extract unique languages and genres
  const languages = useMemo(
    () => ["all", ...new Set(mockSongs.map((s) => s.language))],
    []
  );
  const genres = useMemo(
    () => ["all", ...new Set(mockSongs.map((s) => s.genre))],
    []
  );
  const artists = useMemo(() => ["all", ...mockArtists], []);

  // Utility function to normalize text (remove accents/diacritics)
  const normalizeText = (text: string): string => {
    return text
      .normalize("NFD") // Decompose combined characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
      .toLowerCase();
  };

  // Filter songs
  const filteredSongs = useMemo(() => {
    let results = mockSongs.filter((song) => {
      // Search query with accent-insensitive matching
      if (searchQuery) {
        const normalizedQuery = normalizeText(searchQuery);
        const normalizedTitle = normalizeText(song.title);
        const normalizedLyrics = normalizeText(song.lyrics);

        const inTitle = normalizedTitle.includes(normalizedQuery);
        const inLyrics = normalizedLyrics.includes(normalizedQuery);

        if (searchIn === "title" && !inTitle) return false;
        if (searchIn === "lyrics" && !inLyrics) return false;
        if (searchIn === "all" && !inTitle && !inLyrics) return false;
      }

      // Language filter
      if (language !== "all" && song.language !== language) return false;

      // Genre filter
      if (genre !== "all" && song.genre !== genre) return false;

      // Artist filter
      if (artist !== "all" && song.artist !== artist) return false;

      // Date range
      if (dateFrom && song.releaseDate < dateFrom) return false;
      if (dateTo && song.releaseDate > dateTo) return false;

      return true;
    });

    // Sort results
    if (sortBy === "alphabetical") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "newest") {
      results.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    } else if (sortBy === "mostListened") {
      // Mock: randomize for demo
      results.sort(() => Math.random() - 0.5);
    }
    // relevance: keep natural order when searching

    return results;
  }, [searchQuery, language, genre, artist, searchIn, dateFrom, dateTo, sortBy]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Indicate that a search has been performed and show the loading
      // indicator.  Once the simulated delay completes we clear the
      // loading flag.  This mimics a real network request.
      setIsSearching(true);
      setHasSearched(true);
      // Record in search history
      addToSearchHistory({
        query: searchQuery,
        filters: {
          language: language !== "all" ? language : undefined,
          genre: genre !== "all" ? genre : undefined,
          artist: artist !== "all" ? artist : undefined,
          searchIn: searchIn !== "all" ? searchIn : undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        },
      });
      // Simulate a short network delay so that the loading message is visible.
      // Without this the UI would switch directly to the results and the
      // loading message would flash too quickly to be noticed.
      setTimeout(() => {
        setIsSearching(false);
      }, 500);
    }
  };

  const handleSaveSearch = () => {
    if (!searchQuery) {
      toast.error("Enter a search query first");
      return;
    }

    saveSearch({
      query: searchQuery,
      filters: {
        language: language !== "all" ? language : undefined,
        genre: genre !== "all" ? genre : undefined,
        artist: artist !== "all" ? artist : undefined,
        searchIn: searchIn !== "all" ? searchIn : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      },
    });

    toast.success("Search saved!");
  };

  const clearFilters = () => {
    setLanguage("all");
    setGenre("all");
    setArtist("all");
    setSearchIn("all");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters =
    language !== "all" ||
    genre !== "all" ||
    artist !== "all" ||
    searchIn !== "all" ||
    dateFrom ||
    dateTo;

  // Preview data for library and explore
  const savedSongIds = getSavedSongs();
  const savedSongsPreview = mockSongs.filter((s) => savedSongIds.includes(s.id)).slice(0, 3);
  const collectionsPreview = getCreatedCollections().slice(0, 3);

  // Component for clickable song preview card
  const SongPreviewCard = ({ song, badge }: { song: Song; badge?: string }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-3 rounded-lg border bg-white p-3 cursor-pointer hover:shadow-md transition-shadow">
          <img
            src={song.albumArt}
            alt={song.title}
            className="size-16 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm">{song.title}</p>
            <p className="truncate text-xs text-gray-600">{song.artist}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                badge === "language"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {badge === "language" ? song.language : "Recommended"}
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{song.title} - {song.artist}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-4">
            <img
              src={song.albumArt}
              alt={`${song.album} cover`}
              className="size-32 rounded-md object-cover"
            />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Album:</span> {song.album}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Artist:</span> {song.artist}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Language:</span> {song.language}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Genre:</span> {song.genre}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Released:</span> {song.releaseDate}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Duration:</span> {song.duration}
              </p>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Lyrics</h4>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 max-h-64 overflow-y-auto">
              {song.lyrics}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Component for clickable collection card
  const CollectionCard = ({ collection }: { collection: Collection }) => {
    const collectionSongs = mockSongs.filter((s) => collection.songIds.includes(s.id));
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex gap-3 rounded-lg border bg-white p-3 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex size-16 items-center justify-center rounded bg-gradient-to-br from-purple-100 to-blue-100">
              <FolderOpen className="size-8 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-sm">{collection.name}</p>
              <p className="truncate text-xs text-gray-600">{collection.songIds.length} songs</p>
              {collection.description && (
                <p className="mt-1 truncate text-xs text-gray-500">{collection.description}</p>
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{collection.name}</DialogTitle>
            {collection.description && (
              <p className="text-sm text-gray-600">{collection.description}</p>
            )}
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {collection.songIds.length} song{collection.songIds.length !== 1 ? "s" : ""}
              </p>
            </div>
            {collectionSongs.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {collectionSongs.map((song) => (
                  <div key={song.id} className="flex gap-3 rounded-lg border bg-white p-3">
                    <img
                      src={song.albumArt}
                      alt={song.title}
                      className="size-16 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">{song.title}</p>
                      <p className="truncate text-xs text-gray-600">{song.artist}</p>
                      <div className="mt-1 flex gap-1">
                        <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                          {song.language}
                        </span>
                        <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                          {song.genre}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-500">No songs in this collection</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for words or phrases in songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              // Increase the padding and font size to make the search bar feel more
              // prominent.  The left padding is kept for the search icon.
              className="pl-10 py-3 text-base sm:text-lg"
            />
          </div>

          <Button
            onClick={handleSearch}
            className="gap-2 px-5 py-3 text-base"
          >
            <Search className="size-4" />
            Search
          </Button>

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="size-4" />
                Filters
                {hasActiveFilters && (
                  <span className="flex size-2 rounded-full bg-blue-600"></span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Search Filters</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {/* Search In */}
                <div className="space-y-2">
                  <Label>Word Location</Label>
                  <Select value={searchIn} onValueChange={setSearchIn}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Title & Lyrics</SelectItem>
                      <SelectItem value="title">Title Only</SelectItem>
                      <SelectItem value="lyrics">Lyrics Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang === "all" ? "All Languages" : lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Artist */}
                <div className="space-y-2">
                  <Label>Artist / Playlist</Label>
                  <Select value={artist} onValueChange={setArtist}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {artists.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a === "all" ? "All Artists" : a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g === "all" ? "All Genres" : g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Release Date</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      placeholder="From"
                    />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      placeholder="To"
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={clearFilters}
                  >
                    <X className="size-4" />
                    Reset Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Button onClick={handleSaveSearch} variant="outline" className="gap-2">
            <Bookmark className="size-4" />
            Save Search
          </Button>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {language !== "all" && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                Language: {language}
              </span>
            )}
            {artist !== "all" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                Artist: {artist}
              </span>
            )}
            {genre !== "all" && (
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                Genre: {genre}
              </span>
            )}
            {searchIn !== "all" && (
              <span className="rounded-full bg-pink-100 px-3 py-1 text-xs text-pink-700">
                In: {searchIn}
              </span>
            )}
            {(dateFrom || dateTo) && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
                Date: {dateFrom || "..."} - {dateTo || "..."}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {hasSearched && (
        <>
          {/* When searching, show a loading state with a clear message. */}
          {isSearching ? (
            <div className="rounded-lg border border-dashed bg-white p-12 text-center">
              <Search className="mx-auto mb-4 size-12 animate-spin text-gray-300" />
              <h3 className="mb-2 font-semibold text-gray-700">Searching songs…</h3>
              <p className="text-sm text-gray-500">Please wait while we look for matches.</p>
            </div>
          ) : (
            <>
              {/* Breadcrumb navigation helps orient the user within the app. */}
              <div className="mb-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <Link to="/">Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <span>Search</span>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Results for "{searchQuery}"</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Found {filteredSongs.length} song{filteredSongs.length !== 1 ? "s" : ""} for "{searchQuery}"
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-[180px]">
                      <ArrowUpDown className="mr-2 size-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="mostListened">Most Listened</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredSongs.length === 0 ? (
                  <div className="rounded-lg border border-dashed bg-white p-12 text-center">
                    <Search className="mx-auto mb-4 size-12 text-gray-300" />
                    <h3 className="mb-2 font-semibold text-gray-700">No songs found</h3>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search query or filters
                    </p>
                  </div>
                ) : (
                  filteredSongs.map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      highlightWords={searchQuery ? [searchQuery] : []}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* Preview Sections - shown when no search has been performed */}
      {!hasSearched && (
        <div className="space-y-8">
          {/* Library Preview */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Library className="size-5 text-gray-700" />
                <h2 className="text-lg font-semibold">My Library Preview</h2>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/library">View All</Link>
              </Button>
            </div>

            {savedSongsPreview.length > 0 || collectionsPreview.length > 0 ? (
              <div className="space-y-3">
                {savedSongsPreview.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Recent Saved Songs</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                      {savedSongsPreview.map((song) => (
                        <SongPreviewCard key={song.id} song={song} badge="language" />
                      ))}
                    </div>
                  </div>
                )}

                {collectionsPreview.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Your Collections</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                      {collectionsPreview.map((collection) => (
                        <CollectionCard key={collection.id} collection={collection} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-white p-8 text-center">
                <Library className="mx-auto mb-2 size-8 text-gray-300" />
                <p className="text-sm text-gray-500">Your library is empty. Start saving songs!</p>
              </div>
            )}
          </section>

          {/* Explore Preview */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="size-5 text-gray-700" />
                <h2 className="text-lg font-semibold">Explore</h2>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/explore">View All</Link>
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {mockSongs.slice(0, 3).map((song) => (
                <SongPreviewCard key={song.id} song={song} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
