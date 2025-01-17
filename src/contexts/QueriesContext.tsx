import { getQueries, getTotalCount } from "@/services/queryServices";
import { QuerySchema } from "@/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useQueryFilter } from "./FilterQueryContext";
import { QUERY_STATUS } from "@/types/enums";

interface QueriesContextType {
  isLoading: boolean;
  queries: QuerySchema[];
  totalCount: number;
  refreshQueries: () => void;
}

export const QuerysContext = createContext<QueriesContextType | undefined>(
  undefined
);

export const QueriesContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [queries, setQueries] = useState<QuerySchema[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { filterOptions } = useQueryFilter();

  useEffect(() => {
    fetchTotalCount({
      status: filterOptions.status,
      query: filterOptions.query,
      fromDate: filterOptions.fromDate?.toISOString().slice(0, -5),
      toDate: filterOptions.toDate?.toISOString().slice(0, -5),
    });
    fetchQueries({
      currentPage: filterOptions.currentPage,
      pageSize: filterOptions.pageSize,
      query: filterOptions.query,
      status: filterOptions.status,
      fromDate: filterOptions.fromDate?.toISOString().slice(0, -5),
      toDate: filterOptions.toDate?.toISOString().slice(0, -5),
      orderBy: filterOptions.orderBy,
      isAscending: filterOptions.isAscending,
    });
  }, [filterOptions]);

  const fetchQueries = async ({
    currentPage,
    pageSize,
    query,
    status,
    fromDate = undefined,
    toDate = undefined,
    orderBy = "",
    isAscending = undefined,
  }: {
    currentPage: number;
    pageSize: number;
    query: string;
    status: QUERY_STATUS | undefined | null;
    fromDate?: string;
    toDate?: string;
    isAscending: boolean | undefined;
    orderBy: string;
  }) => {
    if (status === undefined) {
      return;
    }
    setIsLoading(true);
    const offset = pageSize * (currentPage - 1);
    const limit = pageSize;
    getQueries({
      offset,
      limit,
      query,
      status,
      fromDate,
      toDate,
      orderBy,
      isAscending,
    })
      .then((queries: QuerySchema[]) => {
        setIsLoading(false);
        setQueries(queries);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  const fetchTotalCount = async ({
    status,
    query,
    fromDate,
    toDate,
  }: {
    query?: string;
    status?: string | null;
    fromDate?: string;
    toDate?: string;
  }) => {
    if (status === undefined) {
      return;
    }
    getTotalCount({
      status,
      query,
      fromDate,
      toDate,
    }).then((count) => {
      setTotalCount(count);
    });
  };

  const refreshQueries = () => {
    fetchQueries({
      currentPage: filterOptions.currentPage,
      pageSize: filterOptions.pageSize,
      query: filterOptions.query,
      status: filterOptions.status,
      fromDate: filterOptions.fromDate?.toISOString().slice(0, -5),
      toDate: filterOptions.toDate?.toISOString().slice(0, -5),
      orderBy: filterOptions.orderBy,
      isAscending: filterOptions.isAscending,
    });
  };

  return (
    <QuerysContext.Provider
      value={{
        isLoading,
        queries,
        totalCount,
        refreshQueries,
      }}
    >
      {children}
    </QuerysContext.Provider>
  );
};

export const useQuries = (): QueriesContextType => {
  const context = useContext(QuerysContext);
  if (context === undefined) {
    throw new Error("useQuries must be used within a QueriesContextProvider");
  }
  return context;
};
