import * as React from "react";
import { useContext, useMemo } from "react";

import { ListHandlerPagination } from "../../../model/IListProps";

type IContext = ListHandlerPagination;

/**
 * @interface IProps
 * @extends IContext
 * @description Represents the properties of a React component.
 */
interface IProps extends IContext {
  children: React.ReactNode;
}

const PaginationContext = React.createContext<IContext>(null as never);

/**
 * PaginationProvider component serves as a provider for limiting and offsetting pagination data.
 *
 * @param children - The child component(s) that will be rendered within the provider.
 * @param limit - The maximum number of items to be displayed per page.
 * @param offset - The starting index of the items to be displayed.
 *
 * @returns - The PaginationProvider component.
 */
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
