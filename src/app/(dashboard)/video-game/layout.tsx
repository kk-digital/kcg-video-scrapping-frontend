"use client";

import Toolbar from "@/components/VideoGame/Toolbar";
import { VideoGameFilterContextProvider } from "@/contexts/FilterVideoGameContext";
import { VideoGamesContextProvider } from "@/contexts/VideoGameContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col text-center p-4 overflow-auto bg-white">
      <VideoGameFilterContextProvider>
        <VideoGamesContextProvider>
          <Toolbar />
          <div className="flex-1 flex flex-col overflow-auto">{children}</div>
        </VideoGamesContextProvider>
      </VideoGameFilterContextProvider>
    </div>
  );
}
