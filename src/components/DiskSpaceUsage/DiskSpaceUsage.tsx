import React from "react";
import { HardDrive, Database } from "lucide-react";
import { formatBytes } from "@/utils/format";

interface DiskSpaceUsageProps {
  totalSpace: number; // in GB
  freeSpace: number; // in GB
  percentage: number; // in GB
}

const DiskSpaceUsage: React.FC<DiskSpaceUsageProps> = ({
  totalSpace,
  freeSpace,
  percentage,
}) => {
  return (
    <div className="flex gap-4 p-2 rounded-lg">
      <div className="flex gap-2 items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center">
          <HardDrive className="w-4 h-4 mr-2 text-blue-500" />
          Disk Space Usage
        </h2>
      </div>

      <div className="relative pt-1 min-w-36 m-auto">
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-blue-100">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300 ease-in-out"
          ></div>
        </div>
      </div>

      <div className="flex gap-2 justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <Database className="w-4 h-4 mr-1 text-blue-500" />
          <span>Free: {formatBytes(freeSpace)}</span>
        </div>
        <div className="flex items-center">
          <Database className="w-4 h-4 mr-1 text-green-500" />
          <span>Total: {formatBytes(totalSpace)}</span>
        </div>
      </div>
    </div>
  );
};

export default DiskSpaceUsage;
