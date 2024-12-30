import { getVideoGames, getTotalCount } from "@/services/videoGameServices";
import { VideoGameSchema } from "@/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useVideoGameFilter } from "./FilterVideoGameContext";

interface VideoGamesContextType {
  isLoading: boolean;
  videoGames: VideoGameSchema[];
  totalCount: number;
  refreshVideoGames: () => void;
}

export const VideoGamesContext = createContext<
  VideoGamesContextType | undefined
>(undefined);

export const VideoGamesContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoGames, setVideoGames] = useState<VideoGameSchema[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { filterOptions } = useVideoGameFilter();

  useEffect(() => {
    fetchTotalCount();
    fetchVideoGames({
      currentPage: filterOptions.currentPage,
      pageSize: filterOptions.pageSize,
      title: filterOptions.videoGameTitle,
    });
  }, [filterOptions]);

  const fetchVideoGames = async ({
    currentPage,
    pageSize,
    title = "",
  }: {
    currentPage: number;
    pageSize: number;
    title: string;
  }) => {
    setIsLoading(true);
    const offset = pageSize * (currentPage - 1);
    const limit = pageSize;
    getVideoGames(offset, limit, title)
      .then((videoGames: VideoGameSchema[]) => {
        setIsLoading(false);
        setVideoGames(videoGames);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const fetchTotalCount = async () => {
    getTotalCount().then((count) => {
      setTotalCount(count);
    });
  };

  const refreshVideoGames = () => {
    fetchVideoGames({
      currentPage: filterOptions.currentPage,
      pageSize: filterOptions.pageSize,
      title: filterOptions.videoGameTitle,
    });
  };

  return (
    <VideoGamesContext.Provider
      value={{
        isLoading,
        videoGames,
        totalCount,
        refreshVideoGames,
      }}
    >
      {children}
    </VideoGamesContext.Provider>
  );
};

export const useVideoGames = (): VideoGamesContextType => {
  const context = useContext(VideoGamesContext);
  if (context === undefined) {
    throw new Error(
      "useVideoGames must be used within a VideoGamesContextProvider"
    );
  }
  return context;
};
