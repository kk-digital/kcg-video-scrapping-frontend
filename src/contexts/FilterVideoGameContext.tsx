import { createContext, useContext, useState, ReactNode } from "react";

export interface VideoGameFilterOption {
  currentPage: number;
  pageSize: number;
  videoGameTitle: string;
  videoGameId: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  orderBy: string;
  isAscending: boolean | undefined;
}

interface VideoGameFilterContextType {
  filterOptions: VideoGameFilterOption;
  setFilterOptions: (option: VideoGameFilterOption) => void;
}

export const VideoGameFilterContext = createContext<
  VideoGameFilterContextType | undefined
>(undefined);

export const VideoGameFilterContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filterOptions, setFilterOptions] = useState<VideoGameFilterOption>({
    currentPage: 1,
    pageSize: 10,
    videoGameTitle: "",
    videoGameId: "",
    fromDate: undefined,
    toDate: undefined,
    orderBy: "",
    isAscending: undefined,
  });

  return (
    <VideoGameFilterContext.Provider
      value={{ filterOptions, setFilterOptions }}
    >
      {children}
    </VideoGameFilterContext.Provider>
  );
};

export const useVideoGameFilter = (): VideoGameFilterContextType => {
  const context = useContext(VideoGameFilterContext);
  if (context === undefined) {
    throw new Error(
      "useVideoGameFilter must be used within a VideoGameFilterContextProvider"
    );
  }
  return context;
};
