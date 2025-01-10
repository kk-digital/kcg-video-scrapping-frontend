import { classNames } from "@/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

const SortableHeader = ({
  label,
  value,
  orderBy,
  isAscending,
  handleChangeSort,
}: {
  label: string;
  value: string;
  orderBy: string;
  isAscending: boolean | undefined;
  handleChangeSort: (value: string) => void;
}) => {
  return (
    <div
      className="flex flex-row items-center gap-2 text-left text-xs text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => handleChangeSort(value)}
    >
      <span className="text-nowrap text-gray-500">{label}</span>
      <div className="flex flex-col rounded-md">
        <ChevronUp
          className={classNames(
            "w-4 h-3",
            orderBy === value && isAscending === false
              ? "fill-blue-600 stroke-blue-600"
              : "fill-gray-400 stroke-gray-600"
          )}
        />
        <ChevronDown
          className={classNames(
            "w-4 h-3",
            orderBy === value && isAscending === true
              ? "fill-blue-600 stroke-blue-600"
              : "fill-gray-400 stroke-gray-400"
          )}
        />
      </div>
    </div>
  );
};

export default SortableHeader;
