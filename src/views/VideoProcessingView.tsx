"use client";

import IngressVideoItem from "@/components/IngressVideo/IngressVideoItem";
import SpinLoader from "@/components/Loader/SpinLoader";
import IngressVideoDetailedViewModal from "@/components/Modal/IngressVideoDetailedViewModal";
import Pagination from "@/components/Pagination/Pagination";
import SortableHeader from "@/components/Table/SortableHeader";
import { useIngressVideoFilter } from "@/contexts/FilterIngressVideoContext";
import { useIngressVideos } from "@/contexts/IngressVideoContext";
import { retryDownloadingVideos } from "@/services/ingressVideoServices";
import { IngressVideoSchema } from "@/types";
import { INGRESS_VIDEO_STATUS } from "@/types/enums";
import {
  ArrowUpCircleIcon,
  ChevronDownCircle,
  RefreshCwIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

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
  const { isLoading, totalCount, ingressVideos, refreshIngressVideos } =
    useIngressVideos();
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

  const handleCheckboxClick = (checked: boolean, videoId: string) => {
    if (checked) {
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

  const handleRetry = () => {
    retryDownloadingVideos(selectedVideoIds).then((success) => {
      if (success) {
        setSelectedItems(0);
        setSelectedVideoIds([]);
        refreshIngressVideos();
        toast.success("Retry to download videos successfully");
      } else {
        // show error
        toast.error("Failed to retry to download videos");
      }
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
            <button
              className="btn-secondary text-sm px-3 py-1 flex items-center gap-1 bg-green-500 hover:bg-green-600"
              onClick={() => {
                handleRetry();
              }}
            >
              <RefreshCwIcon className="w-4 h-4" />
              Retry
            </button>
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48 max-w-56 overflow-hidden text-ellipsis">
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

                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {/* Example row */}
                {ingressVideos.map((video, index) => (
                  <IngressVideoItem
                    key={index}
                    index={index}
                    video={video}
                    onSelect={(checked: boolean, video_id: string) => {
                      handleCheckboxClick(checked, video_id);
                    }}
                    onView={() => {
                      setVideoDetailedViewOpen({ isOpen: true, video: video });
                    }}
                    selected={selectedVideoIds.includes(video.video_id)}
                  />
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
