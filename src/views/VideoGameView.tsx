"use client";

import SpinLoader from "@/components/Loader/SpinLoader";
import Pagination from "@/components/Pagination/Pagination";
import SortableHeader from "@/components/Table/SortableHeader";
import { useVideoGameFilter } from "@/contexts/FilterVideoGameContext";
import { useVideoGames } from "@/contexts/VideoGameContext";
import {
  deleteVideoGame,
  deleteVideoGames,
} from "@/services/videoGameServices";
import { VideoGameSchema } from "@/types";
import { formatDateTimeReadable } from "@/utils/format";
import { PenIcon, TrashIcon, XCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function VideoGameProcessingView() {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { refreshVideoGames } = useVideoGames();
  const { filterOptions, setFilterOptions } = useVideoGameFilter();
  const { isLoading, videoGames, totalCount } = useVideoGames();
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState();
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
  }, [selectedItems, videoGames?.length]);

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

  const handleChangeSort = (label: string) => {
    setFilterOptions({
      ...filterOptions,
      orderBy: label,
      isAscending:
        filterOptions.orderBy === label ? !filterOptions.isAscending : true,
    });
  };

  const handleUpate = (videoGame: VideoGameSchema) => {
    //  TODO: add logic to update video game
  };

  const handleDeleteVideoGame = (videoGameId: string) => {
    deleteVideoGame(videoGameId).then((success) => {
      if (success) {
        refreshVideoGames();
        toast.success("Successfully deleted");
      } else {
        toast.success("Failed to delete!");
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
                    <SortableHeader
                      label="id"
                      value="id"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortableHeader
                      label="video game title"
                      value="title"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-36 overflow-hidden text-ellipsis">
                    video Game Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-36 overflow-hidden text-ellipsis">
                    <SortableHeader
                      label="created at"
                      value="created_at"
                      orderBy={filterOptions.orderBy}
                      isAscending={filterOptions.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example row */}
                {videoGames?.map((videoGame, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`video-game-${index}`}
                          onChange={(e) =>
                            handleCheckboxClick(e, videoGame.game_id)
                          }
                          checked={selectedVideoGameIds.includes(
                            videoGame.game_id
                          )}
                        />
                        <label
                          className="text-sm text-gray-600 hover:cursor-pointer"
                          htmlFor={`video-game-${index}`}
                        >
                          {videoGame.game_id}
                        </label>
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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex gap-2 items-center">
                        <PenIcon
                          className="w-4 h-4 stroke-blue-500 hover:stroke-blue-700 hover:cursor-pointer"
                          onClick={() => {}}
                        />
                        <TrashIcon
                          className="w-4 h-4 stroke-red-500 hover:stroke-red-700 hover:cursor-pointer"
                          onClick={() => {
                            handleDeleteVideoGame(videoGame.game_id);
                          }}
                        />
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
