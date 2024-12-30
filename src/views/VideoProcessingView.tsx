"use client";

import SpinLoader from "@/components/Loader/SpinLoader";
import Pagination from "@/components/Pagination/Pagination";
import { useIngressVideoFilter } from "@/contexts/FilterIngressVideoContext";
import { useIngressVideos } from "@/contexts/IngressVideoContext";
import { INGRESS_VIDEO_STATUS } from "@/types/enums";
import { formatBytes, formatSecondsToHHMMSS } from "@/utils/format";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import {
  Clock,
  Loader,
  Download,
  XCircle,
  PlayCircle,
  AlertTriangleIcon,
  ArrowUpCircleIcon,
  ChevronDownCircle,
  RefreshCwIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";

const statusIcons: { [key: string]: JSX.Element } = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  downloading: <Loader className="w-5 h-5 text-blue-500 animate-spin" />,
  downloaded: <Download className="w-5 h-5 text-green-500" />,
  canceled: <XCircle className="w-5 h-5 text-gray-500" />,
  failed: <AlertTriangleIcon className="w-5 h-5 text-red-500" />,
};

export default function VideoProcessingView({
  status = undefined,
}: {
  status: INGRESS_VIDEO_STATUS | undefined;
}) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { isLoading, totalCount, ingressVideos } = useIngressVideos();
  const { filterOptions, setFilterOptions } = useIngressVideoFilter();
  const [selectedItems, setSelectedItems] = useState(0);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

  useEffect(() => {
    setFilterOptions({
      ...filterOptions,
      status: status,
    });
  }, []);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedItems > 0 && selectedItems < ingressVideos.length;
      if (selectedItems > 0) {
        setShowBulkActions(true);
      } else {
        setShowBulkActions(false);
      }
    }
  }, [selectedItems, ingressVideos.length]);

  const handleBuckCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedItems(ingressVideos.length);
      setSelectedVideoIds(ingressVideos.map((video) => video.video_id));
    } else {
      setSelectedItems(0);
      setSelectedVideoIds([]);
    }
    setShowBulkActions(checked);
  };

  const handleCheckboxClick = (
    e: React.ChangeEvent<HTMLInputElement>,
    videoId: string
  ) => {
    if (e.target.checked) {
      setSelectedItems(selectedItems + 1);
      setSelectedVideoIds([...selectedVideoIds, videoId]);
    } else {
      setSelectedItems(selectedItems - 1);
      setSelectedVideoIds(selectedVideoIds.filter((id) => id !== videoId));
    }
  };

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg min-h-12 mb-2">
        <div className="flex items-center gap-2">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={
              selectedItems > 0 && selectedItems === ingressVideos.length
            }
            className=""
            onChange={(e) => {
              handleBuckCheckboxChange(e);
            }}
          />
          <span className="text-sm text-gray-600">
            {selectedItems} items selected
          </span>
        </div>
        {showBulkActions && (
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm px-3 py-1 flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" />
              Cancel
            </button>
            <button className="btn-secondary text-sm px-3 py-1 flex items-center gap-1">
              <RefreshCwIcon className="w-4 h-4" />
              Restart
            </button>
            <div className="relative">
              <button className="btn-secondary text-sm px-3 py-1 flex items-center gap-1">
                <ArrowUpCircleIcon className="w-4 h-4" />
                Set Priority
                <ChevronDownCircle className="w-4 h-4" />
              </button>
              {/* Dropdown menu for priority levels would go here */}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col w-full bg-white rounded-lg shadow overflow-y-auto">
        {/* Table */}
        {isLoading ? (
          <SpinLoader />
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="bg-gray-200 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-36 overflow-hidden text-ellipsis">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolution
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FPS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Length
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Size
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example row */}
                {ingressVideos.map((video, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleCheckboxClick(e, video.video_id)
                          }
                          checked={selectedVideoIds.includes(video.video_id)}
                        />
                        {video.video_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="truncate max-w-36 hover:underline">
                        {video.video_title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center  hover:cursor-pointer">
                        <PlayCircle className="w-4 h-4  text-gray-400 mr-2" />
                        <span className="truncate max-w-48 hover:underline ">
                          {video.video_title}
                        </span>
                      </div>
                      <a className={`video-description-${video.video_id} flex`}>
                        <ListBulletIcon className="w-4 h-4  text-gray-400 mr-2" />
                        <div className="max-w-48 text-left text-ellipsis line-clamp-2 text-xs hover:cursor-pointer text-gray-500">
                          {video.video_description.length > 60
                            ? video.video_description.slice(0, 60) + "..."
                            : video.video_description}
                        </div>
                      </a>

                      <Tooltip
                        anchorSelect={`.video-description-${video.video_id}`}
                        place="top"
                      >
                        <div className="max-w-lg">
                          {video.video_description}
                        </div>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        {video.video_resolution}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        {video.video_frame_rate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        {formatSecondsToHHMMSS(video.video_length)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        {formatBytes(video.video_filesize)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2 capitalize">
                        {statusIcons[video.status]}
                        {video.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-end px-16">
        <Pagination
          className="pagination-bar"
          totalCount={totalCount}
          pageSize={filterOptions.pageSize}
          onPageChange={(pageSize: number, currentPage: number) => {
            setFilterOptions({
              ...filterOptions,
              pageSize: pageSize,
              currentPage: currentPage,
            });
          }}
        />
      </div>
    </>
  );
}
