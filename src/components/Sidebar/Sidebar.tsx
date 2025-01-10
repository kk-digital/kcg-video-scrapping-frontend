"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Video, Menu, X, Gamepad2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { classNames } from "@/utils";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  return (
    <>
      <button
        className="fixed top-4 left-4 z-50  md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <h1 className="text-xl font-bold">KCG Video Scrapping</h1>
        </div>
        <nav className="mt-8">
          <Link
            href="/video-game"
            className={classNames(
              "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700",
              path.includes("/video-game") ? "bg-gray-500" : ""
            )}
          >
            <Gamepad2Icon className="mr-3" size={20} />
            <span>Video Game</span>
          </Link>
          <Link
            href="/search-query"
            className={classNames(
              "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700",
              path.includes("/search-query") ? "bg-gray-500" : ""
            )}
          >
            <Search className="mr-3" size={20} />
            <span>Search Query</span>
          </Link>
          <Link
            href="/ingress-video"
            className={classNames(
              "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700",
              path.includes("/ingress-video") ? "bg-gray-500" : ""
            )}
          >
            <Video className="mr-3" size={20} />
            <span>Ingress Video</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
