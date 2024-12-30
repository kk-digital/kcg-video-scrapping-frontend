import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, RefreshCw, Plus } from "lucide-react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "react-tooltip";
import { QueryCreateSchema, VideoGameSchema } from "@/types";
import { VideoGameSelect } from "../VideoGame/Select";
import { addQuery } from "@/services/queryServices";
import { useQuries } from "@/contexts/QueriesContext";
import { toast } from "react-toastify";

interface AddQueryModalProps {
  isOpen: boolean;
  videoGames: VideoGameSchema[];
  onClose: () => void;
  onAdd: (selectedQuerys: QueryCreateSchema) => void;
}

const AddQueryModal: React.FC<AddQueryModalProps> = ({
  isOpen,
  videoGames,
  onClose,
  onAdd,
}) => {
  const { refreshQueries } = useQuries();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gameId, setGameId] = useState("");
  const handleAddQuery = () => {
    if (query === "" || gameId === "") {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    addQuery({ query: query, game_id: gameId })
      .then((success) => {
        if (success) {
          toast.success("Query Added Successfully");
          setQuery("");
          setGameId("");
          setIsLoading(false);
          refreshQueries();
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
          toast.error("Failed to add query");
        }
        console.error("Error adding query:", error);
        setIsLoading(false);
      });
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
                <div className="flex flex-col gap-4 py-16">
                  <div className="flex items-center gap-2">
                    <input
                      id="query-query"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter URL"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <a className={`query-query-information flex`}>
                      <InformationCircleIcon className="w-5 h-5 text-gray-400" />
                    </a>
                    <Tooltip
                      anchorSelect={`.query-query-information`}
                      place="top"
                    >
                      <div className="max-w-lg">
                        You can put the youtube query query or the youtube
                        channel query here.
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <VideoGameSelect
                      videoGames={videoGames}
                      selectedVideoGameId={gameId}
                      onSelect={(id) => {
                        setGameId(id);
                      }}
                    />
                    <a className={`video-game-information flex`}>
                      <InformationCircleIcon className="w-5 h-5 text-gray-400" />
                    </a>
                    <Tooltip
                      anchorSelect={`.video-game-information`}
                      place="top"
                    >
                      <div className="max-w-lg">
                        You can select video stream.
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button onClick={onClose} className="btn-secondary">
                    Cancel
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={() => handleAddQuery()}
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

export default AddQueryModal;
