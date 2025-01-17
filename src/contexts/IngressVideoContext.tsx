import {
  getIngressVideos,
  getTotalCount,
} from "@/services/ingressVideoServices";
import { IngressVideoSchema } from "@/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useIngressVideoFilter } from "./FilterIngressVideoContext";
import { INGRESS_VIDEO_STATUS } from "@/types/enums";

interface IngressVideosContextType {
  isLoading: boolean;
  ingressVideos: IngressVideoSchema[];
  totalCount: number;
  refreshIngressVideos: () => void;
}

export const IngressVideosContext = createContext<
  IngressVideosContextType | undefined
>(undefined);

export const IngressVideosContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ingressVideos, setIngressVideos] = useState<IngressVideoSchema[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { filterOptions } = useIngressVideoFilter();

  // const [ws, setWs] = useState<WebSocket | null>(null);
  // useEffect(() => {
  //   const websocket = new WebSocket(
  //     `${process.env.NEXT_PUBLIC_API_URL?.replace(
  //       "http",
  //       "ws"
  //     )}/ws/downloading-videos`
  //   );

  //   websocket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log(data);
  //   };

  //   setWs(websocket);

  //   return () => {
  //     websocket.close();
  //   };
  // }, []);

  useEffect(() => {
    fetchTotalCount({
      status: filterOptions.status,
      title: filterOptions.title,
    });
    fetchIngressVideos({
      currentPage: filterOptions.currentPage,
      pageSize: filterOptions.pageSize,
      title: filterOptions.title,
      status: filterOptions.status,
      orderBy: filterOptions.orderBy,
      isAscending: filterOptions.isAscending,
    });
  }, [filterOptions]);

  const fetchIngressVideos = async ({
    currentPage,
    pageSize,
    title = "",
    status = undefined,
    orderBy = "",
    isAscending = undefined,
  }: {
    currentPage: number;
    pageSize: number;
    title: string;
    status: INGRESS_VIDEO_STATUS | undefined;
    isAscending: boolean | undefined;
    orderBy: string;
  }) => {
    setIsLoading(true);
    const offset = pageSize * (currentPage - 1);
    const limit = pageSize;
    getIngressVideos({ offset, limit, title, status, orderBy, isAscending })
      .then((ingressVideos: IngressVideoSchema[]) => {
        setIsLoading(false);
        setIngressVideos(ingressVideos);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const fetchTotalCount = async ({
    status,
    title,
  }: {
    status: INGRESS_VIDEO_STATUS | undefined;
    title?: string;
  }) => {
    getTotalCount(status, title).then((count) => {
      setTotalCount(count);
    });
  };

  const refreshIngressVideos = () => {
    fetchIngressVideos({
      currentPage: filterOptions.currentPage,
      pageSize: filterOptions.pageSize,
      title: filterOptions.title,
      status: filterOptions.status,
      orderBy: filterOptions.orderBy,
      isAscending: filterOptions.isAscending,
    });
  };

  return (
    <IngressVideosContext.Provider
      value={{
        isLoading,
        ingressVideos,
        totalCount,
        refreshIngressVideos,
      }}
    >
      {children}
    </IngressVideosContext.Provider>
  );
};

export const useIngressVideos = (): IngressVideosContextType => {
  const context = useContext(IngressVideosContext);
  if (context === undefined) {
    throw new Error(
      "useIngressVideos must be used within a IngressVideosContextProvider"
    );
  }
  return context;
};
