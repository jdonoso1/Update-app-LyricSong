import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";
import { initializeMockData } from "./data/initializeMockData";

export default function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}