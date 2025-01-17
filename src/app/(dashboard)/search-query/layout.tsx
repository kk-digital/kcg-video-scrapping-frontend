"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import Toolbar from "@/components/SearchQuery/Toolbar";
import { QueryFilterContextProvider } from "@/contexts/FilterQueryContext";
import { QueriesContextProvider } from "@/contexts/QueriesContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { id: "all", label: "All", link: "/search-query" },
    { id: "pending", label: "Pending", link: "/search-query/pending" },
    {
      id: "extracting",
      label: "Extracting",
      link: "/search-query/extracting",
    },
    {
      id: "extracted",
      label: "Extracted",
      link: "/search-query/extracted",
    },
    { id: "failed", label: "Failed", link: "/search-query/failed" },
  ];

  return (
    <div className="flex-1 flex flex-col text-center p-4 overflow-auto bg-white">
      <QueryFilterContextProvider>
        <QueriesContextProvider>
          <Toolbar />
          <div className="border-b border-gray-200">
            <nav className="flex space-x-2 px-4">
              {tabs.map((tab) => (
                <>
                  <Link href={tab.link}>
                    <button
                      key={tab.id}
                      className={`
                  px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150
                  ${
                    pathname === tab.link
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
                    >
                      {tab.label}
                    </button>
                  </Link>
                </>
              ))}
            </nav>
          </div>
          <div className="flex-1 flex flex-col overflow-auto">{children}</div>
        </QueriesContextProvider>
      </QueryFilterContextProvider>
    </div>
  );
}
