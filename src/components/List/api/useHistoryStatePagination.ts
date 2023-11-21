import { useCallback, useEffect, useMemo, useState } from "react";

import IAnything from "../../../model/IAnything";
import IListProps from "../../../model/IListProps";
import IRowData from "../../../model/IRowData";

import useActualValue from "../../../hooks/useActualValue";

import removeEmptyFiltersDefault from "../helpers/removeEmptyFilters";

import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../config";

import History from "../../../model/History";

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

interface IParams<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> {
  initialValue: IQuery<FilterData, RowData>;
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

type FilterDataT<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> = Exclude<IQuery<FilterData, RowData>["filterData"], undefined>;

type SortModelT<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything
> = Exclude<IQuery<FilterData, RowData>["sortModel"], undefined>;

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
  const getLocationState = useCallback(() => {
    if (history.location.state) {
      return history.location.state as any;
    }
    return {};
  }, []);

  const [state, setState] = useState<IQuery<FilterData, RowData>>(() => ({
    ...initialValue,
    ...getLocationState(),
  }));

  const state$ = useActualValue(state);

  useEffect(
    () =>
      history.listen(({ location }) => {
        const state = {
          ...initialValue,
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
