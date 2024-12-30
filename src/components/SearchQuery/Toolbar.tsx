import { CirclePlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import AddQueryModal from "../Modal/AddQueryModal";
import { QueryCreateSchema, VideoGameSchema } from "@/types";
import { getVideoGames } from "@/services/videoGameServices";
import { useQueryFilter } from "@/contexts/FilterQueryContext";

export default function Toolbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoGames, setVideoGames] = useState<VideoGameSchema[]>([]);
  const { filterOptions, setFilterOptions } = useQueryFilter();
  const fetchVideoGames = async () => {
    getVideoGames(0, 9999999, "")
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
