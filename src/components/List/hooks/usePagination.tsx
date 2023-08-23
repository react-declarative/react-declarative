import * as React from "react";
import { useContext, useMemo } from "react";

import { ListHandlerPagination } from "../../../model/IListProps";

type IContext = ListHandlerPagination;

interface IProps extends IContext {
  children: React.ReactNode;
}

const PaginationContext = React.createContext<IContext>(null as never);

export const PaginationProvider = ({ children, limit, offset }: IProps) => {
  const value = useMemo(
    () => ({
      limit,
      offset,
    }),
    [limit, offset]
  );

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};
export const usePagination = () => useContext(PaginationContext);

export default usePagination;
