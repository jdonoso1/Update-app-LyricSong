import { Outlet, Link, useLocation } from "react-router";
import { Home, Library, Compass, User, Music } from "lucide-react";

export function Root() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/library", label: "My Library", icon: Library },
    { path: "/explore", label: "Explore", icon: Compass },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="size-8 text-blue-600" />
            <div>
              <h1 className="font-semibold text-xl">LyricLearn</h1>
              <p className="text-xs text-gray-500">Learn languages through music</p>
            </div>
          </div>

          <nav className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}