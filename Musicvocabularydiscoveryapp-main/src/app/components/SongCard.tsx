import { useState } from "react";
import { Heart, Library, Play, Plus } from "lucide-react";
import { Song } from "../data/mockSongs";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { saveSong, unsaveSong, isSongSaved, getCollections, addSongToCollection, addToRecentlyListened, createCollection } from "../utils/storage";
import { toast } from "sonner";

interface SongCardProps {
  song: Song;
  highlightWords?: string[];
}

export function SongCard({ song, highlightWords = [] }: SongCardProps) {
  const [saved, setSaved] = useState(isSongSaved(song.id));
  const [showCollections, setShowCollections] = useState(false);
  const [showSongDetails, setShowSongDetails] = useState(false);
  const [collections, setCollections] = useState(getCollections());
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  const toggleSave = () => {
    if (saved) {
      unsaveSong(song.id);
      setSaved(false);
      toast.success("Song removed from saved");
    } else {
      saveSong(song.id);
      setSaved(true);
      toast.success("Song saved!");
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    addSongToCollection(collectionId, song.id);
    setShowCollections(false);
    setIsCreatingNew(false);
    toast.success("Added to collection!");
  };

  const handleCreateAndAdd = () => {
    if (!newCollectionName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    const newCollection = createCollection({
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim(),
      songIds: [song.id],
      isOwned: true,
    });

    setCollections(getCollections());
    setNewCollectionName("");
    setNewCollectionDescription("");
    setIsCreatingNew(false);
    setShowCollections(false);
    toast.success(`Created "${newCollection.name}" and added song!`);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setShowCollections(open);
    if (!open) {
      setIsCreatingNew(false);
      setNewCollectionName("");
      setNewCollectionDescription("");
    } else {
      // Refresh collections when opening
      setCollections(getCollections());
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Track as recently listened
    addToRecentlyListened(song.id);
    toast.success("Playing song...");
  };

  const handleCardClick = () => {
    setShowSongDetails(true);
  };

  const highlightText = (text: string) => {
    if (highlightWords.length === 0) return text;

    let result = text;
    highlightWords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      result = result.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <>
      <div 
        className="group flex gap-4 rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Album Art */}
        <div className="relative size-24 shrink-0 overflow-hidden rounded-md">
          <img
            src={song.albumArt}
            alt={`${song.album} cover`}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
            <Play className="size-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>

        {/* Song Info */}
        <div className="flex flex-1 flex-col gap-2">
          <div>
            <h3 className="font-semibold">{song.title}</h3>
            <p className="text-sm text-gray-600">{song.artist}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
              {song.language}
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700">
              {song.genre}
            </span>
            <span className="text-gray-500">{song.releaseDate}</span>
            <span className="text-gray-500">{song.duration}</span>
          </div>

          {/* Lyrics Preview */}
          <p className="line-clamp-2 text-sm text-gray-700">
            {highlightText(song.lyrics)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant={saved ? "default" : "outline"}
            size="icon"
            onClick={toggleSave}
            title={saved ? "Remove from saved" : "Save song"}
          >
            <Heart className={`size-4 ${saved ? "fill-current" : ""}`} />
          </Button>

          <Dialog open={showCollections} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Add to collection">
                <Library className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Add to Collection</DialogTitle>
              </DialogHeader>
              
              {!isCreatingNew ? (
                <div className="space-y-4">
                  {collections.length > 0 && (
                    <div>
                      <Label>Select Collection</Label>
                      <Select onValueChange={handleAddToCollection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>
                        <SelectContent>
                          {collections.map((collection) => (
                            <SelectItem key={collection.id} value={collection.id}>
                              {collection.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {collections.length > 0 && (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or</span>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsCreatingNew(true)}
                  >
                    <Plus className="mr-2 size-4" />
                    Create New Collection
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-collection-name">Collection Name</Label>
                    <Input
                      id="new-collection-name"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="e.g., Spanish Vocabulary"
                      className="mt-1.5"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-collection-description">Description (optional)</Label>
                    <Input
                      id="new-collection-description"
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                      placeholder="e.g., Songs for learning Spanish verbs"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setNewCollectionName("");
                        setNewCollectionDescription("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={handleCreateAndAdd}
                    >
                      Create & Add Song
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="icon"
            onClick={handlePlay}
            title="Play song"
          >
            <Play className="size-4" />
          </Button>
        </div>
      </div>

      {/* Song Details Dialog */}
      <Dialog open={showSongDetails} onOpenChange={setShowSongDetails}>
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
                {highlightText(song.lyrics)}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}