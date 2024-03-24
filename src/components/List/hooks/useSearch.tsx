import * as React from "react";
import { useContext } from "react";

type IContext = string;

/**
 * @typedef {Object} IProps
 * @property {IContext} value - The context value to be passed to the children.
 * @property {React.ReactNode} children - The React node to be rendered as children.
 */
interface IProps {
  value: IContext;
  children: React.ReactNode;
}

const SearchContext = React.createContext<IContext>(null as never);

/**
 * Represents a component that provides search functionality.
 * @param props - The props object containing the component's properties.
 * @param props.value - The search value to be provided to child components.
 */
export const SearchProvider = (props: IProps) => (
  <SearchContext.Provider value={props.value}>
    {props.children}
  </SearchContext.Provider>
);

export const useSearch = () =>
  useContext(SearchContext);

export default useSearch;
