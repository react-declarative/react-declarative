import * as React from "react";
import { useContext } from "react";

type IContext = string;

interface IProps {
  value: IContext;
  children: React.ReactNode;
}

const SearchContext = React.createContext<IContext>(null as never);

export const SearchProvider = (props: IProps) => (
  <SearchContext.Provider value={props.value}>
    {props.children}
  </SearchContext.Provider>
);

export const useSearch = () =>
  useContext(SearchContext);

export default useSearch;
