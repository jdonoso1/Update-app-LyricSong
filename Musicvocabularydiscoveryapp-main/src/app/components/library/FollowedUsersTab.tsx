import { Users, UserMinus } from "lucide-react";
import { Button } from "../ui/button";

export function FollowedUsersTab() {
  // Mock data - in a real app this would come from a backend
  const followedUsers = [
    { id: "1", name: "Maria L.", collections: 12, followers: 234 },
    { id: "2", name: "Jean-Pierre D.", collections: 8, followers: 156 },
    { id: "3", name: "Carmen R.", collections: 15, followers: 445 },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Followed Users ({followedUsers.length})</h2>
        <p className="text-sm text-gray-600">
          Users whose collections you're following
        </p>
      </div>

      {followedUsers.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-12 text-center">
          <Users className="mx-auto mb-4 size-12 text-gray-300" />
          <h3 className="mb-2 font-semibold text-gray-700">No followed users</h3>
          <p className="text-sm text-gray-500">
            Follow users to see their collections and get notified of updates
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {followedUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
                  <Users className="size-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-xs text-gray-600">{user.followers} followers</p>
                </div>
              </div>

              <div className="mb-3 text-sm text-gray-600">
                {user.collections} public collections
              </div>

              <Button variant="outline" size="sm" className="gap-2">
                <UserMinus className="size-4" />
                Unfollow
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
