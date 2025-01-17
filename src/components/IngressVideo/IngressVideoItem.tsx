import { IngressVideoSchema } from "@/types";
import {
  formatBytes,
  formatDateTimeReadable,
  formatSecondsToHHMMSS,
} from "@/utils/format";
import { ListBulletIcon } from "@heroicons/react/20/solid";
import {
  AlertTriangleIcon,
  BarChart,
  Clock,
  Download,
  Loader,
  PlayCircle,
  Timer,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const statusIcons: { [key: string]: JSX.Element } = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  downloading: <Loader className="w-5 h-5 text-blue-500 animate-spin" />,
  downloaded: <Download className="w-5 h-5 text-green-500" />,
  canceled: <XCircle className="w-5 h-5 text-gray-500" />,
  failed: <AlertTriangleIcon className="w-5 h-5 text-red-500" />,
};

interface IngressVideoItemProps {
  video: IngressVideoSchema;
  index: number;
  onSelect: (checked: boolean, videoId: string) => void;
  onView: () => void;
  selected: boolean;
}
const IngressVideoItem = ({
  index,
  video,
  onSelect,
  onView,
  selected,
}: IngressVideoItemProps) => {
  return (
    <tr key={index} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
        <span className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) => onSelect(e.target.checked, video.video_id)}
            checked={selected}
          />
          {video.video_id}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-900">
        <div className="flex items-center  hover:cursor-pointer">
          <PlayCircle className="w-4 h-4  text-gray-400 mr-2" />
          <span className="truncate max-w-56 hover:underline ">
            <Link href={video.video_url} target="_blank">
              {video.video_title}
            </Link>
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-900">
        <div className="flex items-center gap-2 capitalize">
          {statusIcons[video.status]}
          {video.status}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-900">
        <div className="flex items-center" onClick={onView}>
          <ListBulletIcon className="size-4! max-w-4 text-gray-400 mr-2" />
          <div className="max-w-48 text-left text-ellipsis line-clamp-2 text-xs hover:cursor-pointer text-gray-500">
            {video.video_description.length > 80
              ? video.video_description.slice(0, 80) + "..."
              : video.video_description}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-900">
        <div className="flex items-center">{video.video_resolution}</div>
      </td>
      <td className="px-6 py-4 text-gray-900">
        <div className="flex items-center">{video.video_frame_rate}</div>
      </td>
      <td className="px-6 py-4 text-gray-900">
        <div className="flex items-center">
          {formatSecondsToHHMMSS(video.video_length)}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-900">
        <div className="flex items-center">
          {formatBytes(video.video_filesize)}
        </div>
      </td>
      <td className="py-4 px-6 text-xs text-gray-900">
        <div className="space-y-0.5 min-w-56">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-2 text-blue-500" />
            <span className="font-bold">Started At:</span>
            <span className="ml-2">
              {formatDateTimeReadable(video.started_at)}
            </span>
          </div>
          <div className="flex items-center">
            <Timer className="w-3 h-3 mr-2 text-green-500" />
            <span className="font-bold">Elapsed Time:</span>
            <span className="ml-2">
              {video.elapsed_time ? video.elapsed_time : "N/A"}
            </span>
          </div>
          <div className="flex items-center">
            <BarChart className="w-3 h-3 mr-2 text-yellow-500" />
            <span className="font-bold">Progress:</span>
            <span className="ml-2">50%</span>
          </div>
        </div>
      </td>
      
    </tr>
  );
};

export default IngressVideoItem;
