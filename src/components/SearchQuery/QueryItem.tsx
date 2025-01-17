import { getVideoGame } from "@/services/videoGameServices";
import {
  QueryCreateSchema,
  QuerySchema,
  QueryUpdateSchema,
  VideoGameSchema,
} from "@/types";
import { formatDateTimeReadable } from "@/utils/format";
import {
  AlertTriangleIcon,
  CheckCheck,
  Clock,
  Loader,
  PenIcon,
  TrashIcon,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const statusIcons: { [key: string]: JSX.Element } = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  extracting: <Loader className="w-5 h-5 text-blue-500 animate-spin" />,
  extracted: <CheckCheck className="w-5 h-5 text-green-500" />,
  canceled: <XCircle className="w-5 h-5 text-gray-500" />,
  failed: <AlertTriangleIcon className="w-5 h-5 text-red-500" />,
};

interface QueryItemProps {
  index: number;
  query: QuerySchema;
  onDelete: (queryId: string) => void;
  onUpdate: (query: QueryUpdateSchema | QueryCreateSchema) => void;
  onSelect: (checked: boolean, queryId: string) => void;
  selected: boolean;
}

const QueryItem = ({
  index,
  query,
  onDelete,
  onUpdate,
  onSelect,
  selected,
}: QueryItemProps) => {
  const [videoGame, setVideoGame] = useState<VideoGameSchema | undefined>(
    undefined
  );

  useEffect(() => {
    if (query.game_id) {
      getVideoGame(query.game_id).then((videoGame) => {
        setVideoGame(videoGame);
      });
    }
  }, [query.game_id]);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) => {
              onSelect(e.target.checked, query.id);
            }}
            checked={selected}
          />
          {index + 1}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="hover:underline text-left">{query.query}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="hover:underline text-left">{videoGame?.title ?? "N/A"}</div>
      </td>
      
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="flex items-center  hover:cursor-pointer">
          {formatDateTimeReadable(query.created_at)}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="flex items-center gap-2 capitalize">
          {statusIcons[query.status]}
          {query.status}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="flex gap-2 items-center">
          <PenIcon
            className="w-4 h-4 stroke-blue-500 hover:stroke-blue-700 hover:cursor-pointer"
            onClick={() => {
              onUpdate(query);
            }}
          />
          <TrashIcon
            className="w-4 h-4 stroke-red-500 hover:stroke-red-700 hover:cursor-pointer"
            onClick={() => {
              onDelete(query.id);
            }}
          />
        </div>
      </td>
    </tr>
  );
};

export default QueryItem;
