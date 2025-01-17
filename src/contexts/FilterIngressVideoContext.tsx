import { INGRESS_VIDEO_STATUS } from "@/types/enums";
import { createContext, useContext, useState, ReactNode } from "react";

export interface IngressVideoFilterOption {
  currentPage: number;
  pageSize: number;
  title: string;
  status: INGRESS_VIDEO_STATUS | undefined | null;
  orderBy: string;
  isAscending: boolean | undefined;
}

interface IngressVideoFilterContextType {
  filterOptions: IngressVideoFilterOption;
  setFilterOptions: (option: IngressVideoFilterOption) => void;
}

export const IngressVideoFilterContext = createContext<
  IngressVideoFilterContextType | undefined
>(undefined);

export const IngressVideoFilterContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filterOptions, setFilterOptions] = useState<IngressVideoFilterOption>({
    currentPage: 1,
    pageSize: 10,
    title: "",
    status: undefined,
    orderBy: "",
    isAscending: undefined,
  });

  return (
    <IngressVideoFilterContext.Provider
      value={{ filterOptions, setFilterOptions }}
    >
      {children}
    </IngressVideoFilterContext.Provider>
  );
};

export const useIngressVideoFilter = (): IngressVideoFilterContextType => {
  const context = useContext(IngressVideoFilterContext);
  if (context === undefined) {
    throw new Error(
      "useIngressVideoFilter must be used within a IngressVideoFilterContextProvider"
    );
  }
  return context;
};
