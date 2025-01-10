import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, RefreshCw, Plus } from "lucide-react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "react-tooltip";
import { VideoGameSchema } from "@/types";
import { addVideoGame } from "@/services/videoGameServices";
import { toast } from "react-toastify";

interface AddVideoGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (videoGame: VideoGameSchema) => void;
}

const AddVideoGameModal: React.FC<AddVideoGameModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [videoGameId, setVideoGameId] = useState("");
  const [videoGameTitle, setVideoGameTitle] = useState("");
  const [videoGameDesp, setVideoGameDesp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleAddVideoGame = () => {
    setIsLoading(true);
    if (videoGameId === "" || videoGameTitle === "") {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    addVideoGame({
      game_id: videoGameId,
      title: videoGameTitle,
      description: videoGameDesp,
    } as VideoGameSchema)
      .then((success) => {
        if (success) {
          toast.success("Video Game Added Successfully");
          setVideoGameId("");
          setVideoGameTitle("");
          setVideoGameDesp("");
          setIsLoading(false);
          onAdd({
            game_id: videoGameId,
            title: videoGameTitle,
            description: videoGameDesp,
          } as VideoGameSchema);
          onClose();
        } else {
          toast.error("Failed to add video game");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          toast.error(
            error.response.data.detail || "Validation error occurred"
          );
        } else {
          toast.error("Failed to add video game");
        }
        console.error("Error adding video game:", error);
        setIsLoading(false);
        setIsLoading(false);
      });
  };

  const handleCancel = () => {
    setVideoGameId("");
    setVideoGameTitle("");
    setVideoGameDesp("");
    onClose();
  };

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="min-h-screen text-center">
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
            className="w-full h-screen flex items-center justify-center"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-lg overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="bg-white w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Add Video Game
                    </h2>
                  </div>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddVideoGame} className="p-4 space-y-2">
                  {/* Steam ID Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="steamId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Video Game Steam Id
                      </label>
                      <div>
                        <a className={`video-game-id flex`}>
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Title Information"
                          >
                            <InformationCircleIcon className="w-5 h-5 text-gray-400" />
                          </button>
                        </a>
                        <Tooltip anchorSelect={`.video-game-id`} place="top">
                          <div className="max-w-lg text-xs">
                            You can put video game id. It is same to stream id
                            here.
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                    <input
                      type="text"
                      id="steamId"
                      name="steamId"
                      value={videoGameId}
                      onChange={(e) => setVideoGameId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                      placeholder="Enter Steam ID"
                    />
                  </div>

                  {/* Title Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Video Game Title
                      </label>
                      {/* Tooltip for video game title */}
                      <div>
                        <a className={`video-game-title flex`}>
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Title Information"
                          >
                            <InformationCircleIcon className="w-5 h-5 text-gray-400" />
                          </button>
                        </a>
                        <Tooltip anchorSelect={`.video-game-title`} place="top">
                          <div className="max-w-lg text-xs">
                            You can put video game title
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={videoGameTitle}
                      onChange={(e) => setVideoGameTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                      placeholder="Enter game title"
                    />
                  </div>
                  {/* Description Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Video Game Description
                      </label>
                      <div>
                        <a className={`video-game-description flex`}>
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Title Information"
                          >
                            <InformationCircleIcon className="w-5 h-5 text-gray-400" />
                          </button>
                        </a>
                        <Tooltip
                          anchorSelect={`.video-game-description`}
                          place="top"
                        >
                          <div className="max-w-lg text-xs">
                            You can put video game description
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      value={videoGameDesp}
                      onChange={(e) => setVideoGameDesp(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                      placeholder="Enter game description"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleCancel()}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={() => handleAddVideoGame()}
                      className="btn-primary flex items-center justify-center"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5 mr-2" />
                      )}
                      ADD
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddVideoGameModal;
