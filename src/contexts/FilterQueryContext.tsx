import { QUERY_STATUS } from "@/types/enums";
import { createContext, useContext, useState, ReactNode } from "react";

export interface QueryFilterOption {
  currentPage: number;
  pageSize: number;
  query: string;
  status: QUERY_STATUS | undefined;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  orderBy: string;
  isAscending: boolean | undefined;
}

interface QueryFilterContextType {
  filterOptions: QueryFilterOption;
  setFilterOptions: (option: QueryFilterOption) => void;
}

export const QueryFilterContext = createContext<
  QueryFilterContextType | undefined
>(undefined);

export const QueryFilterContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filterOptions, setFilterOptions] = useState<QueryFilterOption>({
    currentPage: 1,
    pageSize: 10,
    query: "",
    status: undefined,
    fromDate: undefined,
    toDate: undefined,
    orderBy: "",
    isAscending: undefined,
  });

  return (
    <QueryFilterContext.Provider value={{ filterOptions, setFilterOptions }}>
      {children}
    </QueryFilterContext.Provider>
  );
};

export const useQueryFilter = (): QueryFilterContextType => {
  const context = useContext(QueryFilterContext);
  if (context === undefined) {
    throw new Error(
      "useQueryFilter must be used within a QueryFilterContextProvider"
    );
  }
  return context;
};
