"use client";

import SpinLoader from "@/components/Loader/SpinLoader";
import Pagination from "@/components/Pagination/Pagination";
import { useVideoGameFilter } from "@/contexts/FilterVideoGameContext";
import { useVideoGames } from "@/contexts/VideoGameContext";
import { deleteVideoGames } from "@/services/videoGameServices";
import { formatDateTimeReadable } from "@/utils/format";
import { XCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function VideoGameProcessingView() {
  const checkboxRef = useRef<HTMLInputElement>(null);
  // const [pageSize, setPageSize] = useState<number>(10);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const { refreshVideoGames } = useVideoGames();
  const { filterOptions, setFilterOptions } = useVideoGameFilter();
  const { isLoading, videoGames, totalCount } = useVideoGames();
  const [selectedItems, setSelectedItems] = useState(0);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedVideoGameIds, setSelectedVideoGameIds] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selectedItems > 0 && selectedItems < videoGames.length;
      if (selectedItems > 0) {
        setShowBulkActions(true);
      } else {
        setShowBulkActions(false);
      }
    }
  }, [selectedItems, videoGames.length]);

  const handleBuckCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedItems(videoGames.length);
      setSelectedVideoGameIds(videoGames.map((videoGame) => videoGame.game_id));
    } else {
      setSelectedItems(0);
      setSelectedVideoGameIds([]);
    }
    setShowBulkActions(checked);
  };

  const handleCheckboxClick = (
    e: React.ChangeEvent<HTMLInputElement>,
    videoGameId: string
  ) => {
    if (e.target.checked) {
      setSelectedItems(selectedItems + 1);
      setSelectedVideoGameIds([...selectedVideoGameIds, videoGameId]);
    } else {
      setSelectedItems(selectedItems - 1);
      setSelectedVideoGameIds(
        selectedVideoGameIds.filter((id) => id !== videoGameId)
      );
    }
  };

  const handleDeleteVideoGames = () => {
    deleteVideoGames(selectedVideoGameIds).then(() => {
      refreshVideoGames();
      setSelectedItems(0);
      setSelectedVideoGameIds([]);
      toast.success("Video games deleted successfully");
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
            checked={selectedItems > 0 && selectedItems === videoGames.length}
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
              className="btn-warning text-sm px-3 py-1 flex items-center gap-1 text"
              onClick={() => handleDeleteVideoGames()}
            >
              <XCircleIcon className="w-4 h-4" />
              Delete
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
                    Video Game Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-36 overflow-hidden text-ellipsis">
                    video Game Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-36 overflow-hidden text-ellipsis">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example row */}
                {videoGames.map((videoGame, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleCheckboxClick(e, videoGame.game_id)
                          }
                          checked={selectedVideoGameIds.includes(
                            videoGame.game_id
                          )}
                        />
                        {videoGame.game_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="hover:underline text-left">
                        {videoGame.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-96 truncate flex items-center gap-2 capitalize">
                        {videoGame.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-96 truncate flex items-center gap-2 capitalize">
                        {formatDateTimeReadable(videoGame.created_at)}
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
              pageSize,
              currentPage,
            });
          }}
        />
      </div>
    </>
  );
}
