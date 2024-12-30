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
    })
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
          });
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
            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
              >
                <span className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-500" />
                  Add Video Game
                </span>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Title>

              <div className="mt-4">
                <div className="flex flex-col py-16">
                  <label
                    className="text-sm font-medium text-gray-500"
                    htmlFor="video-game-steam-id"
                  >
                    Video Game Steam Id
                  </label>
                  <div className="flex items-center gap-2  mb-4">
                    <input
                      id="video-game-steam-id"
                      type="text"
                      value={videoGameId}
                      onChange={(e) => setVideoGameId(e.target.value)}
                      placeholder="Video Game Steam ID"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <a className={`video-game-id flex`}>
                        <InformationCircleIcon className="w-5 h-5 text-gray-400" />
                      </a>
                      <Tooltip anchorSelect={`.video-game-id`} place="top">
                        <div className="max-w-lg">
                          You can put video game steam id
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <label
                    className="text-sm font-medium text-gray-500"
                    htmlFor="video-game-title"
                  >
                    Vidoe Game Title
                  </label>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      id="video-game-title"
                      type="text"
                      value={videoGameTitle}
                      onChange={(e) => setVideoGameTitle(e.target.value)}
                      placeholder="Video Game Title"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <a className={`video-game-title flex`}>
                        <InformationCircleIcon className="w-5 h-5 text-gray-400" />
                      </a>
                      <Tooltip anchorSelect={`.video-game-title`} place="top">
                        <div className="max-w-lg">
                          You can put video game title
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <label
                    className="text-sm font-medium text-gray-500"
                    htmlFor="video-game-description"
                  >
                    Vidoe Game Description
                  </label>
                  <div className="flex items-center gap-2  mb-4">
                    <textarea
                      id="video-game-description"
                      value={videoGameDesp}
                      onChange={(e) => setVideoGameDesp(e.target.value)}
                      placeholder="Video Game Description"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <a className={`video-game-description flex`}>
                        <InformationCircleIcon className="w-5 h-5 text-gray-400" />
                      </a>
                      <Tooltip
                        anchorSelect={`.video-game-description`}
                        place="top"
                      >
                        <div className="max-w-lg">
                          You can put video game description
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>

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
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddVideoGameModal;
