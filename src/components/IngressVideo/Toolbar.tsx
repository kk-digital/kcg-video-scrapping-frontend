import { SearchIcon } from "lucide-react";
import { useIngressVideoFilter } from "@/contexts/FilterIngressVideoContext";

export default function Toolbar() {
  const { filterOptions, setFilterOptions } = useIngressVideoFilter();
  return (
    <div className="flex justify-between gap-4 px-4 mb-4">
      <div className="flex items-center gap-4">
        <SearchIcon className="w-4 h-4" />
        <input
          className="input-primary"
          placeholder="Search videos"
          value={filterOptions.title}
          onChange={(e) =>
            setFilterOptions({ ...filterOptions, title: e.target.value })
          }
        />
      </div>
    </div>
  );
}
