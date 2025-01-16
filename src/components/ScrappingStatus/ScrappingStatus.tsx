"use client";
import { useEffect, useState } from "react";

const statusIcons: { [key: string]: JSX.Element } = {
  scrapping: <div className="w-5 h-5 rounded-full bg-green-500" />,
  idle: <div className="w-5 h-5 rounded-full bg-red-500" />,
};

enum SCRAPPING_STATUS {
  SCRAPPING = "scrapping",
  IDLE = "idle",
}
export default function ScrappingStatus({
  activeCount,
}: {
  activeCount: number;
}) {
  const [status, setStatus] = useState<SCRAPPING_STATUS>(SCRAPPING_STATUS.IDLE);

  useEffect(() => {
    if (activeCount > 0) {
      setStatus(SCRAPPING_STATUS.SCRAPPING);
    } else {
      setStatus(SCRAPPING_STATUS.IDLE);
    }
  });
  return (
    <>
      <div className="flex items-center gap-2 px-2 capitalize text-sm">
        {statusIcons[status]}{" "}
        {status === SCRAPPING_STATUS.SCRAPPING
          ? `${status}(${activeCount})`
          : `${status}`}
        ...
      </div>
    </>
  );
}
