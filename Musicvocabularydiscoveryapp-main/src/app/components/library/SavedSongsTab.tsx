import { useState } from "react";
import { Music } from "lucide-react";
import { SongCard } from "../SongCard";
import { mockSongs } from "../../data/mockSongs";
import { getSavedSongs } from "../../utils/storage";

export function SavedSongsTab() {
  const [savedIds] = useState(getSavedSongs());
  const savedSongs = mockSongs.filter((song) => savedIds.includes(song.id));

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Saved Songs ({savedSongs.length})
        </h2>
        <p className="text-sm text-gray-600">
          Songs you've saved for future reference
        </p>
      </div>

      {savedSongs.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-12 text-center">
          <Music className="mx-auto mb-4 size-12 text-gray-300" />
          <h3 className="mb-2 font-semibold text-gray-700">No saved songs</h3>
          <p className="text-sm text-gray-500">
            Heart songs from search results to save them here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}
