import { IngressVideoSchema } from "@/types";
import { convertRawStringToDisplay } from "@/utils/format";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

export default function IngressVideoDetailedViewModal({
  open,
  onClose,
  video,
}: {
  open: boolean;
  onClose: () => void;
  video: IngressVideoSchema;
}) {
  return (
    <>
      <Dialog
        open={open}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={onClose}
      >
        <div className="fixed inset-0 z-40 h-full w-full bg-black/75" />
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-2xl rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-8 h-8 hover:bg-gray-200 rounded-full p-1 " />
                </button>
              </div>
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-gray-900 text-center"
              >
                {video.video_title}
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-gray-700 p-4 bg-gray-100">
                <p>{convertRawStringToDisplay(video.video_description)}</p>
              </p>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
