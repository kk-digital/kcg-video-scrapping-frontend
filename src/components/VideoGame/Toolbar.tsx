import { Calendar, CirclePlusIcon, SearchIcon } from "lucide-react";
import VideoGameFormModal from "../Modal/VideoGameFormModal";
import { useState } from "react";
import { useVideoGames } from "@/contexts/VideoGameContext";
import { useVideoGameFilter } from "@/contexts/FilterVideoGameContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { VideoGameSchema } from "@/types";
import { addVideoGame } from "@/services/videoGameServices";

export default function Toolbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filterOptions, setFilterOptions } = useVideoGameFilter();
  const { refreshVideoGames } = useVideoGames();
  const handleAddVideoGame = async (
    videoGame: VideoGameSchema
  ): Promise<boolean> => {
    const success = await addVideoGame(videoGame);
    refreshVideoGames();

    return success;
  };

  return (
    <div className="flex justify-between gap-4 px-4 mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <SearchIcon className="w-4 h-4" />
          <input
            className="input-primary"
            placeholder="Search Video Games..."
            value={filterOptions.videoGameTitle}
            onChange={(e) =>
              setFilterOptions({
                ...filterOptions,
                videoGameTitle: e.target.value,
              })
            }
          />
        </div>
        <div className="flex justify-between items-center gap-4">
          <Calendar className="w-4 h-4" />
          <div className="input-primary flex justify-between items-center gap-1">
            <DatePicker
              selected={filterOptions.fromDate}
              placeholderText="From Date"
              onChange={(date: Date | null) => {
                console.log(date);
                setFilterOptions({
                  ...filterOptions,
                  fromDate: date || undefined,
                });
              }}
              isClearable
              selectsStart
              startDate={filterOptions.fromDate}
              endDate={filterOptions.toDate}
              maxDate={filterOptions.toDate}
              className="w-[92px] p-1 text-xs rounded-md transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500/20"
              popperClassName="z-50"
            />
            -
            <DatePicker
              selected={filterOptions.toDate}
              placeholderText="To Date"
              onChange={(date: Date | null) => {
                setFilterOptions({
                  ...filterOptions,
                  toDate: date || undefined,
                });
              }}
              isClearable
              selectsEnd
              startDate={filterOptions.fromDate}
              endDate={filterOptions.toDate}
              minDate={filterOptions.fromDate}
              className="w-[92px] p-1 text-xs rounded-md transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-0 focus:ring-blue-500/20"
              popperClassName="z-50"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <span className="flex items-center gap-2">
            <CirclePlusIcon className="w-4 h-4" /> ADD
          </span>
        </button>
      </div>

      <VideoGameFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddVideoGame}
      />
    </div>
  );
}
