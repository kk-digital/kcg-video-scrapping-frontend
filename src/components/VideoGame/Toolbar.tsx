import { CirclePlusIcon, SearchIcon } from "lucide-react";
import AddVideoGameModal from "../Modal/AddVideoGameModal";
import { useState } from "react";
import { useVideoGames } from "@/contexts/VideoGameContext";
import { useVideoGameFilter } from "@/contexts/FilterVideoGameContext";

export default function Toolbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filterOptions, setFilterOptions } = useVideoGameFilter();
  const { refreshVideoGames } = useVideoGames();
  const handleAdd = () => {
    refreshVideoGames();
  };

  return (
    <div className="flex justify-between gap-4 px-4 mb-4">
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
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <span className="flex items-center gap-2">
            <CirclePlusIcon className="w-4 h-4" /> ADD
          </span>
        </button>
      </div>

      <AddVideoGameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
