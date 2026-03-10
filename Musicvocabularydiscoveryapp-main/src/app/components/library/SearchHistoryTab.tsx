import { useState } from "react";
import { Trash2, Search, Calendar, Clock, AlertCircle } from "lucide-react";
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
import { getSearchHistory, deleteSearchHistoryItem, clearSearchHistory, SearchHistoryItem } from "../../utils/storage";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function SearchHistoryTab() {
  const [history, setHistory] = useState<SearchHistoryItem[]>(getSearchHistory());
  const [deletingItem, setDeletingItem] = useState<SearchHistoryItem | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const navigate = useNavigate();

  const refreshHistory = () => {
    setHistory(getSearchHistory());
  };

  const handleDelete = () => {
    if (deletingItem) {
      deleteSearchHistoryItem(deletingItem.id);
      setDeletingItem(null);
      refreshHistory();
      toast.success("Item removed from history");
    }
  };

  const handleClearAll = () => {
    clearSearchHistory();
    setShowClearDialog(false);
    refreshHistory();
    toast.success("Search history cleared");
  };

  const handleUseSearch = (item: SearchHistoryItem) => {
    const params = new URLSearchParams();
    params.set("q", item.query);
    if (item.filters.language) params.set("lang", item.filters.language);
    if (item.filters.genre) params.set("genre", item.filters.genre);
    if (item.filters.artist) params.set("artist", item.filters.artist);
    if (item.filters.searchIn) params.set("in", item.filters.searchIn);
    if (item.filters.dateFrom) params.set("from", item.filters.dateFrom);
    if (item.filters.dateTo) params.set("to", item.filters.dateTo);

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
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Search History ({history.length})</h2>
          <p className="text-sm text-gray-600">
            Automatically recorded searches (not manually saved)
          </p>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearDialog(true)}
            className="gap-2"
          >
            <Trash2 className="size-4" />
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-12 text-center">
          <Clock className="mx-auto mb-4 size-12 text-gray-300" />
          <h3 className="mb-2 font-semibold text-gray-700">No search history</h3>
          <p className="text-sm text-gray-500">
            Your searches will be automatically recorded here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Clock className="size-5 text-gray-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="font-semibold">"{item.query}"</h3>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseSearch(item)}
                      className="gap-2"
                    >
                      <Search className="size-3" />
                      Use
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingItem(item)}
                      className="size-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {(item.filters.language ||
                  item.filters.genre ||
                  item.filters.artist ||
                  item.filters.searchIn ||
                  item.filters.dateFrom ||
                  item.filters.dateTo) && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {item.filters.language && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        Language: {item.filters.language}
                      </span>
                    )}
                    {item.filters.artist && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        Artist: {item.filters.artist}
                      </span>
                    )}
                    {item.filters.genre && (
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700">
                        Genre: {item.filters.genre}
                      </span>
                    )}
                    {item.filters.searchIn && (
                      <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700">
                        In: {item.filters.searchIn}
                      </span>
                    )}
                    {(item.filters.dateFrom || item.filters.dateTo) && (
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                        <Calendar className="mr-1 inline size-3" />
                        {item.filters.dateFrom || "..."} - {item.filters.dateTo || "..."}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="size-3" />
                  {formatDate(item.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Single Item */}
      <AlertDialog
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from History?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this search from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Search History?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your search history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
