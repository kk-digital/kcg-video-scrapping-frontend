import { INGRESS_VIDEO_STATUS } from "@/types/enums";
import VideoProcessingView from "@/views/VideoProcessingView";

export default function Page() {
  return <VideoProcessingView status={INGRESS_VIDEO_STATUS.PENDING} />;
}
