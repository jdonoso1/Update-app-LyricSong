import { useState } from "react";
import { Trash2, Search, Calendar, Clock, Bookmark } from "lucide-react";
import { Button } from "../ui/button";
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
import { getSavedSearches, deleteSavedSearch, SavedSearch } from "../../utils/storage";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function SavedSearchesTab() {
  const [searches, setSearches] = useState<SavedSearch[]>(getSavedSearches());
  const [deletingSearch, setDeletingSearch] = useState<SavedSearch | null>(null);
  const navigate = useNavigate();

  const refreshSearches = () => {
    setSearches(getSavedSearches());
  };

  const handleDelete = () => {
    if (deletingSearch) {
      deleteSavedSearch(deletingSearch.id);
      setDeletingSearch(null);
      refreshSearches();
      toast.success("Search deleted");
    }
  };

  const handleUseSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    params.set("q", search.query);
    if (search.filters.language) params.set("lang", search.filters.language);
    if (search.filters.genre) params.set("genre", search.filters.genre);
    if (search.filters.artist) params.set("artist", search.filters.artist);
    if (search.filters.searchIn) params.set("in", search.filters.searchIn);
    if (search.filters.dateFrom) params.set("from", search.filters.dateFrom);
    if (search.filters.dateTo) params.set("to", search.filters.dateTo);

    navigate(`/?${params.toString()}`);
    toast.success("Search loaded!");
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Saved Searches ({searches.length})</h2>
        <p className="text-sm text-gray-600">
          Searches you intentionally saved to use again later
        </p>
      </div>

      {searches.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-12 text-center">
          <Bookmark className="mx-auto mb-4 size-12 text-gray-300" />
          <h3 className="mb-2 font-semibold text-gray-700">No saved searches</h3>
          <p className="text-sm text-gray-500">
            Save searches from the Home page to quickly access them later
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {searches.map((search) => (
            <div
              key={search.id}
              className="flex items-start gap-4 rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Search className="size-5 text-blue-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg">"{search.query}"</h3>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseSearch(search)}
                      className="gap-2"
                    >
                      <Search className="size-3" />
                      Use
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingSearch(search)}
                      className="size-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {(search.filters.language ||
                  search.filters.genre ||
                  search.filters.artist ||
                  search.filters.searchIn ||
                  search.filters.dateFrom ||
                  search.filters.dateTo) && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {search.filters.language && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        Language: {search.filters.language}
                      </span>
                    )}
                    {search.filters.artist && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        Artist: {search.filters.artist}
                      </span>
                    )}
                    {search.filters.genre && (
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700">
                        Genre: {search.filters.genre}
                      </span>
                    )}
                    {search.filters.searchIn && (
                      <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700">
                        In: {search.filters.searchIn}
                      </span>
                    )}
                    {(search.filters.dateFrom || search.filters.dateTo) && (
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                        <Calendar className="mr-1 inline size-3" />
                        {search.filters.dateFrom || "..."} - {search.filters.dateTo || "..."}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="size-3" />
                  Saved on {formatDate(search.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deletingSearch}
        onOpenChange={(open) => !open && setDeletingSearch(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Saved Search?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this saved search? This action cannot be
              undone.
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
