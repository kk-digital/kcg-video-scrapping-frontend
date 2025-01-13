import { INGRESS_VIDEO_STATUS } from "./enums";

export interface IngressVideoSchema {
  video_id: string;
  file_hash: string;
  file_path: string;
  video_url: string;
  video_title: string;
  video_description: string;
  video_resolution: string;
  video_extension: string;
  video_length: number;
  video_filesize: number;
  video_frame_rate: number;
  video_language: string;
  processed: boolean;
  game_id: string;
  upload_date: string;
  started_at: string;
  elapsed_time: number;
  status: INGRESS_VIDEO_STATUS;
}
