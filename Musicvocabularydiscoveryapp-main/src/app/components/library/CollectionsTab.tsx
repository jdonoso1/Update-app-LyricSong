import { useState } from "react";
import { Plus, Trash2, Edit2, Music, FolderPlus, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  getCreatedCollections,
  getSavedCollections,
  createCollection,
  deleteCollection,
  updateCollection,
  removeSongFromCollection,
  Collection,
} from "../../utils/storage";
import { mockSongs } from "../../data/mockSongs";
import { toast } from "sonner";

export function CollectionsTab() {
  const [createdCollections, setCreatedCollections] = useState<Collection[]>(getCreatedCollections());
  const [savedCollections, setSavedCollections] = useState<Collection[]>(getSavedCollections());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const refreshCollections = () => {
    setCreatedCollections(getCreatedCollections());
    setSavedCollections(getSavedCollections());
  };

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    createCollection({
      name: newName.trim(),
      description: newDescription.trim(),
      songIds: [],
      isOwned: true,
    });

    setNewName("");
    setNewDescription("");
    setCreateDialogOpen(false);
    refreshCollections();
    toast.success("Collection created!");
  };

  const handleEdit = () => {
    if (!editingCollection || !newName.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    updateCollection(editingCollection.id, {
      name: newName.trim(),
      description: newDescription.trim(),
    });

    setEditingCollection(null);
    setNewName("");
    setNewDescription("");
    refreshCollections();
    toast.success("Collection updated!");
  };

  const handleDelete = () => {
    if (deletingCollection) {
      deleteCollection(deletingCollection.id);
      setDeletingCollection(null);
      refreshCollections();
      toast.success("Collection deleted");
    }
  };

  const handleRemoveSong = (collectionId: string, songId: string) => {
    removeSongFromCollection(collectionId, songId);
    refreshCollections();
    toast.success("Song removed from collection");
  };

  const openEditDialog = (collection: Collection) => {
    setEditingCollection(collection);
    setNewName(collection.name);
    setNewDescription(collection.description);
  };

  const closeEditDialog = () => {
    setEditingCollection(null);
    setNewName("");
    setNewDescription("");
  };

  const renderCollectionGrid = (collections: Collection[]) => {
    if (collections.length === 0) return null;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => {
          const songs = mockSongs.filter((song) =>
            collection.songIds.includes(song.id)
          );

          return (
            <div
              key={collection.id}
              className="flex flex-col rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{collection.name}</h3>
                  {collection.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {collection.description}
                    </p>
                  )}
                </div>
                {collection.isOwned && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(collection)}
                      className="size-8"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingCollection(collection)}
                      className="size-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="mb-3 text-sm text-gray-500">
                {songs.length} song{songs.length !== 1 ? "s" : ""}
              </div>

              {songs.length > 0 && (
                <div className="space-y-2">
                  {songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-2 rounded border bg-gray-50 p-2"
                    >
                      <img
                        src={song.albumArt}
                        alt={song.title}
                        className="size-10 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{song.title}</p>
                        <p className="truncate text-xs text-gray-600">{song.artist}</p>
                      </div>
                      {collection.isOwned && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          onClick={() => handleRemoveSong(collection.id, song.id)}
                        >
                          <Trash2 className="size-3 text-red-600" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Collections</h2>
          <p className="text-sm text-gray-600">
            Organize songs into themed collections
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Travel Vocabulary"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this collection..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="created" className="space-y-4">
        <TabsList>
          <TabsTrigger value="created" className="gap-2">
            <FolderPlus className="size-4" />
            Created Collections ({createdCollections.length})
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <Save className="size-4" />
            Saved Collections ({savedCollections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="created">
          {createdCollections.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-white p-12 text-center">
              <FolderPlus className="mx-auto mb-4 size-12 text-gray-300" />
              <h3 className="mb-2 font-semibold text-gray-700">No created collections</h3>
              <p className="mb-4 text-sm text-gray-500">
                Create collections to organize songs by themes or learning goals
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                <Plus className="size-4" />
                Create Your First Collection
              </Button>
            </div>
          ) : (
            renderCollectionGrid(createdCollections)
          )}
        </TabsContent>

        <TabsContent value="saved">
          {savedCollections.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-white p-12 text-center">
              <Save className="mx-auto mb-4 size-12 text-gray-300" />
              <h3 className="mb-2 font-semibold text-gray-700">No saved collections</h3>
              <p className="text-sm text-gray-500">
                Save collections created by other users from the Explore page
              </p>
            </div>
          ) : (
            renderCollectionGrid(savedCollections)
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingCollection} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Collection Name *</Label>
              <Input
                id="edit-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingCollection}
        onOpenChange={(open) => !open && setDeletingCollection(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCollection?.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
