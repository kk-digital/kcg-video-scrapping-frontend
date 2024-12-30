"use client";

import Toolbar from "@/components/SearchQuery/Toolbar";
import { QueryFilterContextProvider } from "@/contexts/FilterQueryContext";
import { QueriesContextProvider } from "@/contexts/QueriesContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col text-center p-4 overflow-auto bg-white">
      <QueryFilterContextProvider>
        <QueriesContextProvider>
          <Toolbar />
          <div className="flex-1 flex flex-col overflow-auto">{children}</div>
        </QueriesContextProvider>
      </QueryFilterContextProvider>
    </div>
  );
}
