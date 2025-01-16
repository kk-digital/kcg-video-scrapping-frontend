"use client";

import React, { useEffect, useState } from "react";
import DiskSpaceUsage from "@/components/DiskSpaceUsage/DiskSpaceUsage";
import ScrappingStatus from "@/components/ScrappingStatus/ScrappingStatus";

interface DiskSpace {
  free: number;
  total: number;
  percent: number;
}

const Footer: React.FC = () => {
  const [diskSpace, setDiskSpace] = useState<DiskSpace | null>(null);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(
      `${process.env.NEXT_PUBLIC_API_URL?.replace(
        "http",
        "ws"
      )}/ws/downloads-status`
    );

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "download_status") {
        const diskSpace = data.disk_space;
        const activeCount = data.active_downloads_count ?? 0;
        setDiskSpace({
          free: diskSpace.free,
          total: diskSpace.total,
          percent: diskSpace.percent,
        });
        setActiveCount(activeCount);
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-white border-gray-100 rounded-lg p-1">
      <ScrappingStatus activeCount={activeCount} />
      <DiskSpaceUsage
        totalSpace={diskSpace?.total ?? 0}
        freeSpace={diskSpace?.free ?? 0}
        percentage={diskSpace?.percent ?? 0}
      />
    </div>
  );
};

export default Footer;
