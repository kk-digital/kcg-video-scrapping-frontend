"use client";

import SpinLoader from "@/components/Loader/SpinLoader";
import IngressVideoDetailedViewModal from "@/components/Modal/IngressVideoDetailedViewModal";
import Pagination from "@/components/Pagination/Pagination";
import SortableHeader from "@/components/Table/SortableHeader";
import { useIngressVideoFilter } from "@/contexts/FilterIngressVideoContext";
import { useIngressVideos } from "@/contexts/IngressVideoContext";
import { IngressVideoSchema } from "@/types";
import { INGRESS_VIDEO_STATUS } from "@/types/enums";
import {
  formatBytes,
  formatDateTimeReadable,
  formatSecondsToHHMMSS,
} from "@/utils/format";
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
  Timer,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const statusIcons: { [key: string]: JSX.Element } = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  downloading: <Loader className="w-5 h-5 text-blue-500 animate-spin" />,
  downloaded: <Download className="w-5 h-5 text-green-500" />,
  canceled: <XCircle className="w-5 h-5 text-gray-500" />,
  failed: <AlertTriangleIcon className="w-5 h-5 text-red-500" />,
};

interface IngressVideoDetailedView {
  isOpen: boolean;
  video: IngressVideoSchema;
}

export default function VideoProcessingView({
  status = undefined,
}: {
  status: INGRESS_VIDEO_STATUS | undefined;
}) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [videoDetailedViewOpen, setVideoDetailedViewOpen] = useState<
    IngressVideoDetailedView | undefined
  >(); // description modal
  const { isLoading, totalCount, ingressVideos } = useIngressVideos();
  const { filterOptions, setFilterOptions } = useIngressVideoFilter();
  const [selectedItems, setSelectedItems] = useState(0);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

  useEffect(() => {
    setFilterOptions({
      ...filterOptions,
      status: status,
      currentPage: 1,
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

  const handleChangeSort = (label: string) => {
    setFilterOptions({
      ...filterOptions,
      orderBy: label,
      isAscending:
        filterOptions.orderBy === label ? !filterOptions.isAscending : true,
    });
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
                    <SortableHeader
                      label="resolution"
                      value="video_resolution"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortableHeader
                      label="fps"
                      value="video_frame_rate"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortableHeader
                      label="length"
                      value="video_length"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortableHeader
                      label="file size"
                      value="video_filesize"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {/* Example row */}
                {ingressVideos.map((video, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
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
                    <td className="px-6 py-4 text-gray-900">
                      <div className="flex items-center  hover:cursor-pointer">
                        <PlayCircle className="w-4 h-4  text-gray-400 mr-2" />
                        <span className="truncate max-w-56 hover:underline ">
                          <Link href={video.video_url} target="_blank">
                            {video.video_title}
                          </Link>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <div
                        className="flex gap-2"
                        onClick={() => {
                          setVideoDetailedViewOpen({
                            isOpen: true,
                            video,
                          });
                        }}
                      >
                        <ListBulletIcon className="w-4 h-4  text-gray-400 mr-2" />
                        <div className="max-w-56 text-left text-ellipsis line-clamp-2 text-xs hover:cursor-pointer text-gray-500">
                          {video.video_description.length > 80
                            ? video.video_description.slice(0, 80) + "..."
                            : video.video_description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <div className="flex items-center">
                        {video.video_resolution}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <div className="flex items-center">
                        {video.video_frame_rate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <div className="flex items-center">
                        {formatSecondsToHHMMSS(video.video_length)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <div className="flex items-center">
                        {formatBytes(video.video_filesize)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-900">
                      <div className="space-y-0.5 min-w-56">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-2 text-blue-500" />
                          <span className="font-bold">Started At:</span>
                          <span className="ml-2">
                            {formatDateTimeReadable(video.started_at)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Timer className="w-3 h-3 mr-2 text-green-500" />
                          <span className="font-bold">Elapsed Time:</span>
                          <span className="ml-2">
                            {video.elapsed_time ? video.elapsed_time : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <BarChart className="w-3 h-3 mr-2 text-yellow-500" />
                          <span className="font-bold">Progress:</span>
                          <span className="ml-2">50%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
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

      {/* Video Detailed View Modal */}
      {videoDetailedViewOpen && (
        <IngressVideoDetailedViewModal
          open={videoDetailedViewOpen.isOpen}
          onClose={() => setVideoDetailedViewOpen(undefined)}
          video={videoDetailedViewOpen.video}
        />
      )}

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
