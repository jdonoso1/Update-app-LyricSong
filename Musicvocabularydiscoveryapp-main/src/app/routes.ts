import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { HomePage } from "./components/HomePage";
import { MyLibraryPage } from "./components/MyLibraryPage";
import { ExplorePage } from "./components/ExplorePage";
import { ProfilePage } from "./components/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "library", Component: MyLibraryPage },
      { path: "explore", Component: ExplorePage },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);
