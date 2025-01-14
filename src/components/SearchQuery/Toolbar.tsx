import { Calendar, CirclePlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import AddQueryModal from "../Modal/AddQueryModal";
import { QueryCreateSchema, VideoGameSchema } from "@/types";
import { getVideoGames } from "@/services/videoGameServices";
import { useQueryFilter } from "@/contexts/FilterQueryContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Toolbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoGames, setVideoGames] = useState<VideoGameSchema[]>([]);
  const { filterOptions, setFilterOptions } = useQueryFilter();
  const fetchVideoGames = async () => {
    getVideoGames({ offset: 0, limit: 9999999 })
      .then((videoGames: VideoGameSchema[]) => {
        setLoading(false);
        setVideoGames(videoGames);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchVideoGames();
  }, []);

  const handleAdd = (selectedVideos: QueryCreateSchema) => {
    console.log("Selected videos:", selectedVideos);
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-between gap-4 px-4 mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <SearchIcon className="w-4 h-4" />
          <input
            className="input-primary"
            placeholder="Search Queries..."
            value={filterOptions.query}
            onChange={(e) =>
              setFilterOptions({ ...filterOptions, query: e.target.value })
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
        {loading ? (
          <div>Loading video games...</div>
        ) : (
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-2">
              <CirclePlusIcon className="w-4 h-4" /> ADD
            </span>
          </button>
        )}
      </div>

      <AddQueryModal
        videoGames={videoGames}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
