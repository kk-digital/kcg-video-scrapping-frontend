import { VideoGameSchema } from "@/types";

interface VideoGameSelectProps {
  videoGames: VideoGameSchema[];
  selectedVideoGameId: string;
  onSelect: (videoGameId: string) => void;
}

export const VideoGameSelect = ({
  videoGames,
  selectedVideoGameId,
  onSelect,
}: VideoGameSelectProps) => {
  return (
    <select
      id="video-game-id"
      value={selectedVideoGameId}
      onChange={(e) => onSelect(e.target.value)}
      className="w-full p-2 border rounded-md bg-background text-foreground"
    >
      <option value="">Select a Video Game</option>
      {videoGames?.map((videoGame) => (
        <option key={videoGame.game_id} value={videoGame.game_id}>
          {videoGame.title}
        </option>
      ))}
    </select>
  );
};
