"use client";

import Toolbar from "@/components/IngressVideo/Toolbar";
import { IngressVideoFilterContextProvider } from "@/contexts/FilterIngressVideoContext";
import { IngressVideosContextProvider } from "@/contexts/IngressVideoContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { id: "all", label: "All", link: "/ingress-video" },
    { id: "pending", label: "Pending", link: "/ingress-video/pending" },
    {
      id: "downloading",
      label: "Downloading",
      link: "/ingress-video/downloading",
    },
    {
      id: "downloaded",
      label: "Downloaded",
      link: "/ingress-video/downloaded",
    },
    { id: "failed", label: "Failed", link: "/ingress-video/failed" },
    { id: "canceled", label: "Canceled", link: "/ingress-video/canceled" },
  ];

  return (
    <div className="flex-1 flex flex-col text-center p-4 overflow-y-auto bg-white">
      <IngressVideoFilterContextProvider>
        <IngressVideosContextProvider>
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

          <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
        </IngressVideosContextProvider>
      </IngressVideoFilterContextProvider>
    </div>
  );
}
