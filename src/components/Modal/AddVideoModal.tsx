import React, { useState } from "react";
import { Dialog, Select, Transition } from "@headlessui/react";
import { X, RefreshCw, Plus, PlayCircle } from "lucide-react";
import { formatBytes } from "@/utils/format";
import {
  InformationCircleIcon,
  ListBulletIcon,
} from "@heroicons/react/20/solid";
import { Tooltip } from "react-tooltip";

export interface VideoMetadata {
  video_id: string;
  video_title: string;
  video_description: string;
  video_url: string;
  video_extension: string;
  video_resolution: string;
  video_frame_rate: number;
  video_filesize: number;
}

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedVideos: VideoMetadata[]) => void;
}

const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState<VideoMetadata[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<VideoMetadata[]>([]);

  const handleExtractMetadata = () => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setMetadata([
        {
          video_id: "1",
          video_title: "Video 1",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video1.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 123456789,
        },
        {
          video_id: "2",
          video_title: "Video 2",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video2.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 2345678,
        },
        {
          video_id: "3",
          video_title: "Video 3",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video3.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 34567,
        },
        {
          video_id: "1",
          video_title: "Video 1",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video1.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 123456789,
        },
        {
          video_id: "2",
          video_title: "Video 2",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video2.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 2345678,
        },
        {
          video_id: "3",
          video_title: "Video 3",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video3.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 34567,
        },
        {
          video_id: "1",
          video_title: "Video 1",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video1.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 123456789,
        },
        {
          video_id: "2",
          video_title: "Video 2",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video2.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 2345678,
        },
        {
          video_id: "3",
          video_title: "Video 3",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video3.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 34567,
        },
        {
          video_id: "1",
          video_title: "Video 1",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video1.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 123456789,
        },
        {
          video_id: "2",
          video_title: "Video 2",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video2.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 2345678,
        },
        {
          video_id: "3",
          video_title: "Video 3",
          video_description: "https://example.com/video1.mp4",
          video_url: "https://example.com/video3.mp4",
          video_resolution: "720p",
          video_extension: "mp4",
          video_frame_rate: 30,
          video_filesize: 34567,
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectVideo = (video: VideoMetadata) => {
    setSelectedVideos((prev) =>
      prev.some((v) => v.video_id === video.video_id)
        ? prev.filter((v) => v.video_id !== video.video_id)
        : [...prev, video]
    );
  };

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black opacity-30"
              onClick={onClose}
            />
          </Transition.Child>

          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
              >
                <span className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-500" />
                  Add
                </span>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Title>

              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <a className={`video-url-information flex`}>
                    <InformationCircleIcon className="w-5 h-5 text-gray-500" />
                  </a>
                  <Tooltip anchorSelect={`.video-url-information`} place="top">
                    <div className="max-w-lg">
                      You can put the youtube video url or the youtube channel
                      url here.
                    </div>
                  </Tooltip>
                </div>

                <button
                  onClick={handleExtractMetadata}
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  Extract Metadata
                </button>

                {metadata.length > 0 && (
                  <div className="mt-4 border border-gray-200 rounded-md max-h-[420px] overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input type="checkbox" className="input-primary" />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resolution
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            FPS
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            File Size
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {metadata.map((video) => (
                          <tr key={video.video_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedVideos.some(
                                  (v) => v.video_id === video.video_id
                                )}
                                onChange={() => handleSelectVideo(video)}
                                className="form-checkbox text-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <PlayCircle className="w-4 h-4  text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">
                                  {video.video_title}
                                </span>
                              </div>
                              <a
                                className={`video-description-${video.video_id} flex`}
                              >
                                <ListBulletIcon className="w-4 h-4  text-gray-400 mr-2" />
                                <div className="max-w-48 text-left text-ellipsis line-clamp-2 text-xs hover:cursor-pointer text-gray-500">
                                  {video.video_description.length > 60
                                    ? video.video_description.slice(0, 60) +
                                      "..."
                                    : video.video_description}
                                </div>
                              </a>

                              <Tooltip
                                anchorSelect={`.video-description-${video.video_id}`}
                                place="top"
                              >
                                <div className="max-w-lg">
                                  {video.video_description}
                                </div>
                              </Tooltip>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500">
                                {video.video_resolution}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500">
                                  {video.video_frame_rate}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500">
                                  {formatBytes(video.video_filesize)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {selectedVideos.length > 0 && (
                  <Select
                    className="p-2 mt-8 bg-gray-100 rounded-md w-full"
                    name="status"
                    aria-label="Project status"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="delayed">Delayed</option>
                    <option value="canceled">Canceled</option>
                  </Select>
                )}
                <div className="mt-6 flex justify-end space-x-3">
                  <button onClick={onClose} className="btn-secondary">
                    Cancel
                  </button>
                  <button
                    onClick={() => onAdd(selectedVideos)}
                    disabled={selectedVideos.length === 0}
                    className="btn-primary"
                  >
                    Add Selected
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddVideoModal;
