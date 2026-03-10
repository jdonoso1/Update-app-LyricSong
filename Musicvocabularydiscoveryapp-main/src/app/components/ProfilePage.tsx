import { User, Settings, Music2, Link as LinkIcon, Library } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { getCreatedCollections } from "../utils/storage";
import { mockSongs } from "../data/mockSongs";

export function ProfilePage() {
  const createdCollections = getCreatedCollections();

  // Mock connected accounts
  const connectedAccounts = [
    { name: "Spotify", connected: true, icon: Music2 },
    { name: "Apple Music", connected: false, icon: Music2 },
  ];

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-gray-600">
          Manage your account and streaming connections
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <section className="rounded-lg border bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="size-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Account Settings</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center rounded-full bg-blue-100">
              <User className="size-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Guest User</h3>
              <p className="text-sm text-gray-600">guest@lyriclearn.com</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Learning Languages</Label>
                <Input value="Spanish, French" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Native Language</Label>
                <Input value="English" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Learning Goals</Label>
              <Input value="Intermediate level in 6 months" readOnly />
            </div>
          </div>
        </section>

        {/* Connected Streaming Accounts */}
        <section className="rounded-lg border bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <LinkIcon className="size-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Connected Streaming Accounts</h2>
          </div>

          <p className="mb-4 text-sm text-gray-600">
            Connect your streaming accounts to import playlists and listen to songs directly
          </p>

          <div className="space-y-3">
            {connectedAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <div
                  key={account.name}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
                      <Icon className="size-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-gray-500">
                        {account.connected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button variant={account.connected ? "outline" : "default"} size="sm">
                    {account.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Created Collections */}
        <section className="rounded-lg border bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Library className="size-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Your Created Collections</h2>
            </div>
            <span className="text-sm text-gray-600">
              {createdCollections.length} collections
            </span>
          </div>

          {createdCollections.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Library className="mx-auto mb-2 size-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                You haven't created any collections yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {createdCollections.map((collection) => {
                const songs = mockSongs.filter((s) =>
                  collection.songIds.includes(s.id)
                );
                return (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{collection.name}</p>
                      <p className="text-xs text-gray-600">
                        {songs.length} song{songs.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
