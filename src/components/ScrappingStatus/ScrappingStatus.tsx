"use client";
import { useState } from "react";

const statusIcons: { [key: string]: JSX.Element } = {
  scrapping: <div className="w-5 h-5 rounded-full bg-green-500" />,
  idel: <div className="w-5 h-5 rounded-full bg-red-500" />,
};
export default function ScrappingStatus() {
  const [status, setStatus] = useState<string>("scrapping");
  return (
    <>
      <div className="flex items-center gap-2 px-2 capitalize text-sm">
        {statusIcons[status]} {status}...
      </div>
    </>
  );
}
