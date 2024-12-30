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
    fetchTotalCount();
    fetchQueries({
      currentPage: filterOptions.currentPage,
      pageSize: filterOptions.pageSize,
      query: filterOptions.query,
    });
  }, [filterOptions]);

  const fetchQueries = async ({
    currentPage,
    pageSize,
    query,
  }: {
    currentPage: number;
    pageSize: number;
    query: string;
  }) => {
    setIsLoading(true);
    const offset = pageSize * (currentPage - 1);
    const limit = pageSize;
    getQueries(offset, limit, query)
      .then((queries: QuerySchema[]) => {
        setIsLoading(false);
        setQueries(queries);
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

  const refreshQueries = () => {
    fetchQueries({
      currentPage: filterOptions.currentPage,
      pageSize: filterOptions.pageSize,
      query: filterOptions.query,
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
