import { useState } from "react";
import { Music, Bookmark, Clock, Library as LibraryIcon, Users, FolderPlus, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SavedSongsTab } from "./library/SavedSongsTab";
import { SavedSearchesTab } from "./library/SavedSearchesTab";
import { SearchHistoryTab } from "./library/SearchHistoryTab";
import { CollectionsTab } from "./library/CollectionsTab";
import { FollowedUsersTab } from "./library/FollowedUsersTab";

export function MyLibraryPage() {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">My Library</h1>
        <p className="text-sm text-gray-600">
          Access your saved content and manage your collections
        </p>
      </div>

      <Tabs defaultValue="saved-songs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="saved-songs" className="gap-2">
            <Music className="size-4" />
            <span className="hidden sm:inline">Saved Songs</span>
          </TabsTrigger>
          <TabsTrigger value="saved-searches" className="gap-2">
            <Bookmark className="size-4" />
            <span className="hidden sm:inline">Saved Searches</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="size-4" />
            <span className="hidden sm:inline">Search History</span>
          </TabsTrigger>
          <TabsTrigger value="collections" className="gap-2">
            <LibraryIcon className="size-4" />
            <span className="hidden sm:inline">Collections</span>
          </TabsTrigger>
          <TabsTrigger value="followed" className="gap-2">
            <Users className="size-4" />
            <span className="hidden sm:inline">Followed Users</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved-songs">
          <SavedSongsTab />
        </TabsContent>

        <TabsContent value="saved-searches">
          <SavedSearchesTab />
        </TabsContent>

        <TabsContent value="history">
          <SearchHistoryTab />
        </TabsContent>

        <TabsContent value="collections">
          <CollectionsTab />
        </TabsContent>

        <TabsContent value="followed">
          <FollowedUsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
