import { useCallback, useEffect, useMemo, useState } from "react";

import IAnything from "../../../model/IAnything";
import IListProps from "../../../model/IListProps";
import IRowData from "../../../model/IRowData";

import useActualValue from "../../../hooks/useActualValue";

import removeEmptyFiltersDefault from "../helpers/removeEmptyFilters";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../config";

import History from "../../../model/History";

/**
 * Represents a query object used for filtering, sorting, and pagination.
 * @template FilterData - The type of filter data.
 * @template RowData - The type of row data.
 */
interface IQuery<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> {
  filterData: IListProps<FilterData, RowData>["filterData"];
  sortModel: IListProps<FilterData, RowData>["sortModel"];
  chipData: IListProps<FilterData, RowData>["chipData"];
  limit: IListProps<FilterData, RowData>["limit"];
  page: IListProps<FilterData, RowData>["page"];
  search: IListProps<FilterData, RowData>["search"];
}

/**
 * Represents the parameters for a list component.
 * @template FilterData - The type of data used for filtering.
 * @template RowData - The type of data representing a row.
 */
interface IParams<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> {
  initialValue: Partial<IQuery<FilterData, RowData>>;
  removeEmptyFilters: (data: FilterData) => Partial<FilterData>;
  onFilterChange: IListProps<FilterData, RowData>["onFilterChange"];
  onLimitChange: IListProps<FilterData, RowData>["onLimitChange"];
  onPageChange: IListProps<FilterData, RowData>["onPageChange"];
  onSortModelChange: IListProps<FilterData, RowData>["onSortModelChange"];
  onChipsChange: IListProps<FilterData, RowData>["onChipsChange"];
  onSearchChange: IListProps<FilterData, RowData>["onSearchChange"];
  onChange?: (pagination: IQuery) => void;
  fallback?: (e: Error) => void;
}

/**
 * Represents the result of a query.
 * @template FilterData - The type of the filter data.
 * @template RowData - The type of the row data.
 * @interface
 * @extends IParams - The interface for query parameters.
 * @extends IQuery - The interface for query methods.
 */
interface IResult<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> extends IParams<FilterData, RowData>,
    IQuery<FilterData, RowData> {
  getFilterData: () => FilterDataT<FilterData, RowData>;
  getSortModel: () => SortModelT<FilterData, RowData>;
  getChipData: () => ChipDataT<FilterData, RowData>;
  getLimit: () => number;
  getPage: () => number;
  getSearch: () => string;
  setFilterData: (filterData: FilterDataT<FilterData, RowData>) => void;
  setSortModel: (sortModel: SortModelT<FilterData, RowData>) => void;
  setChipData: (chipData: ChipDataT<FilterData, RowData>) => void;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
}

/**
 * Represents a type that filters data for a query result.
 * @template FilterData - The type of data used for filtering.
 * @template RowData - The type of row data in the query result.
 * @typedef {Exclude<IQuery<FilterData, RowData>["filterData"], undefined>} FilterDataT
 */
type FilterDataT<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> = Exclude<IQuery<FilterData, RowData>["filterData"], undefined>;

/**
 * Represents the sort model of a query.
 *
 * @template FilterData - The type of filter data. Defaults to `IAnything`.
 * @template RowData - The type of row data. Defaults to `IAnything`.
 *
 * @typedef {Exclude<IQuery<FilterData, RowData>["sortModel"], undefined>} SortModelT
 */
type SortModelT<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> = Exclude<IQuery<FilterData, RowData>["sortModel"], undefined>;

/**
 * Represents a type for chip data in a query result.
 *
 * @template FilterData - The type of filter data used in the query.
 * @template RowData - The type of row data returned by the query.
 */
type ChipDataT<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> = Exclude<IQuery<FilterData, RowData>["chipData"], undefined>;

export const DEFAULT_QUERY: IQuery = {
  filterData: {},
  sortModel: [],
  chipData: {},
  limit: DEFAULT_LIMIT,
  page: DEFAULT_PAGE,
  search: "",
};

/**
 * Handles pagination state using browser history state.
 * @template FilterData - The type of filter data for the query.
 * @template RowData - The type of row data for the query.
 * @param history - The history object from react-router.
 * @param options - Optional parameters for configuring the pagination.
 * @param options.initialValue - The initial query value.
 * @param options.onFilterChange - The callback function when filter data changes.
 * @param options.onLimitChange - The callback function when limit changes.
 * @param options.onPageChange - The callback function when page changes.
 * @param options.onSortModelChange - The callback function when sort model changes.
 * @param options.onChipsChange - The callback function when chip data changes.
 * @param options.onSearchChange - The callback function when search changes.
 * @param options.onChange - The callback function when the state changes.
 * @param options.removeEmptyFilters - Indicates whether to remove empty filters from the query.
 * @param options.fallback - The fallback component to render when the query is not available.
 * @returns - An object containing the pagination state and methods.
 * @property listProps - The props to be passed to a list component.
 * @property listProps.onFilterChange - The callback function to handle filter change.
 * @property listProps.onLimitChange - The callback function to handle limit change.
 * @property listProps.onPageChange - The callback function to handle page change.
 * @property listProps.onSortModelChange - The callback function to handle sort model change.
 * @property listProps.onChipsChange - The callback function to handle chip data change.
 * @property listProps.onSearchChange - The callback function to handle search change.
 * @property listProps.fallback - The fallback component to render when the query is not available.
 * @property listProps.filterData - The filter data in the query.
 * @property listProps.sortModel - The sort model in the query.
 * @property listProps.chipData - The chip data in the query.
 * @property listProps.limit - The limit in the query.
 * @property listProps.page - The page in the query.
 * @property listProps.search - The search value in the query.
 * @property getFilterData - Returns the filter data in the query.
 * @property getSortModel - Returns the sort model in the query.
 * @property getChipData - Returns the chip data in the query.
 * @property getLimit - Returns the limit in the query.
 * @property getPage - Returns the page in the query.
 * @property getSearch - Returns the search value in the query.
 * @property setFilterData - Sets the filter data in the query.
 * @property setSortModel - Sets the sort model in the query.
 * @property setChipData - Sets the chip data in the query.
 * @property setLimit - Sets the limit in the query.
 * @property setPage - Sets the page in the query.
 * @property setSearch - Sets the search value in the query.
 */
export const useHistoryStatePagination = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
>(
  history: History,
  {
    initialValue = DEFAULT_QUERY,
    onFilterChange: handleFilterChange = () => null,
    onLimitChange: handleLimitChange = () => null,
    onPageChange: handlePageChange = () => null,
    onSortModelChange: handleSortModelChange = () => null,
    onChipsChange: handleChipsChange = () => null,
    onSearchChange: handleSeachChange = () => null,
    onChange: handleChange = () => null,
    removeEmptyFilters = removeEmptyFiltersDefault,
    fallback,
  }: Partial<IParams<FilterData, RowData>> = {}
) => {

  const defaultQuery = useMemo((): IQuery => ({
    chipData: initialValue.chipData || DEFAULT_QUERY.chipData,
    filterData: initialValue.filterData || DEFAULT_QUERY.filterData,
    limit: initialValue.limit || DEFAULT_QUERY.limit,
    page: initialValue.page || DEFAULT_QUERY.page,
    search: initialValue.search || DEFAULT_QUERY.search,
    sortModel: initialValue.sortModel || DEFAULT_QUERY.sortModel,
  }), []);

  const getLocationState = useCallback(() => {
    if (history.location.state) {
      return history.location.state as any;
    }
    return {};
  }, []);

  const [state, setState] = useState<IQuery<FilterData, RowData>>(() => ({
    ...defaultQuery,
    ...getLocationState(),
  }));

  const state$ = useActualValue(state);

  useEffect(
    () =>
      history.listen(({ location }) => {
        const state = {
          ...defaultQuery,
          ...(location.state as any || {}),
        };
        setState(state);
        handleChange(state);
      }),
    []
  );

  const query = useMemo<IQuery<FilterData, RowData>>(
    () => ({
      filterData: state.filterData || {},
      sortModel: state.sortModel || [],
      chipData: state.chipData || {},
      limit: state.limit || DEFAULT_LIMIT,
      page: state.page || DEFAULT_PAGE,
      search: state.search || "",
    }),
    [state]
  );

  const query$ = useActualValue(query);

  const onFilterChange: IResult<FilterData, RowData>["onFilterChange"] = (
    filterData
  ) => {
    filterData = removeEmptyFilters(filterData) as FilterData;
    history.replace(history.location, {
      ...state$.current,
      filterData: filterData || {},
    });
    handleFilterChange(filterData);
  };

  const onLimitChange: IResult<FilterData, RowData>["onLimitChange"] = (
    limit
  ) => {
    history.replace(history.location, {
      ...state$.current,
      limit,
    });
    handleLimitChange(limit);
  };

  const onPageChange: IResult<FilterData, RowData>["onPageChange"] = (page) => {
    history.replace(history.location, {
      ...state$.current,
      page,
    });
    handlePageChange(page);
  };

  const onSortModelChange: IResult<FilterData, RowData>["onSortModelChange"] = (
    sortModel
  ) => {
    history.replace(history.location, {
      ...state$.current,
      sortModel: sortModel || [],
    });
    handleSortModelChange(sortModel);
  };

  const onChipsChange: IResult<FilterData, RowData>["onChipsChange"] = (
    chipData
  ) => {
    history.replace(history.location, {
      ...state$.current,
      chipData: chipData || {},
    });
    handleChipsChange(chipData);
  };

  const onSearchChange: IResult<FilterData, RowData>["onSearchChange"] = (
    search
  ) => {
    history.replace(history.location, {
      ...state$.current,
      search,
    });
    handleSeachChange(search);
  };

  const getQueryMap = {
    getFilterData: (): FilterDataT<FilterData, RowData> => {
      const { current: query } = query$;
      return query.filterData || {};
    },
    getSortModel: (): SortModelT<FilterData, RowData> => {
      const { current: query } = query$;
      return query.sortModel || [];
    },
    getChipData: (): ChipDataT<FilterData, RowData> => {
      const { current: query } = query$;
      return query.chipData || {};
    },
    getLimit: () => {
      const { current: query } = query$;
      return query.limit || DEFAULT_LIMIT;
    },
    getPage: () => {
      const { current: query } = query$;
      return query.page || DEFAULT_PAGE;
    },
    getSearch: () => {
      const { current: query } = query$;
      return query.search || "";
    },
  };

  const setQueryMap = {
    setFilterData: onFilterChange,
    setSortModel: onSortModelChange,
    setChipData: onChipsChange,
    setLimit: onLimitChange,
    setPage: onPageChange,
    setSearch: onSearchChange,
  };

  return {
    listProps: {
      onFilterChange,
      onLimitChange,
      onPageChange,
      onSortModelChange,
      onChipsChange,
      onSearchChange,
      ...(fallback && { fallback }),
      ...query,
    },
    ...getQueryMap,
    ...setQueryMap,
  };
};

/*
console.log({filterData: (new URL(location.href).searchParams.get('filterData'))});
console.log({sortModel: (new URL(location.href).searchParams.get('sortModel'))});
console.log({chipData: (new URL(location.href).searchParams.get('chipData'))});
console.log({limit: (new URL(location.href).searchParams.get('limit'))});
console.log({page: (new URL(location.href).searchParams.get('page'))});
console.log({search: (new URL(location.href).searchParams.get('search'))});
*/

export default useHistoryStatePagination;
