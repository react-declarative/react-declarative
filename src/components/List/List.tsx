import * as React from 'react';
import { forwardRef } from 'react';
import { useState, useCallback, useLayoutEffect, useEffect, useRef } from 'react';

import { ThemeProvider } from '../../styles';

import IListProps, { IListCallbacks, IListState, ListHandlerChips, ListHandlerResult, ListHandlerSortModel } from '../../model/IListProps';
import TypedField from '../../model/TypedField';
import IAnything from '../../model/IAnything';
import IRowData from '../../model/IRowData';
import IField from '../../model/IField';
import IListApi from '../../model/IListApi';

import initialValue from '../One/config/initialValue';
import deepFlat from '../../utils/deepFlat';
import set from '../../utils/set';

import GridView from './components/view/GridView';
import ChooserView from './components/view/ChooserView';

import { ISelectionReloadRef, SelectionProvider } from './hooks/useSelection';
import { SortModelProvider } from './hooks/useSortModel';
import { ModalSortProvider } from './hooks/useModalSort';
import { CachedRowsProvider } from './hooks/useCachedRows';
import { ChipsProvider } from './hooks/useChips';
import { PropProvider } from './hooks/useProps';

import scrollManager from './helpers/scrollManager';

const DEFAULT_LIMIT = 10;

const ListInternal = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  Field extends IField = IField<IAnything>,
  >(props: IListProps<FilterData, RowData, Field>, ref: any) => {

  const isMounted = useRef(true);

  const selectionApiRef = useRef<ISelectionReloadRef>();

  useLayoutEffect(() => () => {
    isMounted.current = false;
  }, []);

  const {
    handler = () => [],
    fallback = (e) => console.error(e),
    limit: defaultLimit = DEFAULT_LIMIT,
    isChooser: defaultIsChooser = false,
    filters = [],
    columns = [],
    actions = [],
    onSortModelChange = () => null,
    onFilterChange = () => null,
    onChipsChange = () => null,
    onSearchChange = () => null,
    toggleFilters = false,
    selectedRows,
    sortModel: upperSortModel = [],
    chips: upperChips = [],
  } = props;

  const [state, setState] = useState<IListState<FilterData, RowData>>({
    initComplete: false,
    isChooser: defaultIsChooser,
    filterData: {} as never,
    rows: [] as never,
    limit: defaultLimit,
    offset: 0,
    total: null,
    search: "",
    loading: false,
    filtersCollapsed: toggleFilters,
    sort: upperSortModel,
    chips: upperChips.reduce<ListHandlerChips<RowData>>(
      (acm, { name: chip, enabled = false }) => ({ ...acm, [chip]: enabled }),
      {} as any,
    ),
  });

  const setLoading = (loading: boolean) => isMounted.current && setState((prevState) => ({ ...prevState, loading }));

  const setFiltersCollapsed = (filtersCollapsed: boolean) => isMounted.current && setState((prevState) => ({ ...prevState, filtersCollapsed }));

  const { isChooser } = state;

  const handleRows = useCallback(async (filterData: FilterData, keepPagination = false): Promise<{
    rows: RowData[];
    total: number | null;
  }> => {
    if (typeof handler === 'function') {
      const response: ListHandlerResult<RowData> = await Promise.resolve(handler(filterData, {
        limit: state.limit,
        offset: keepPagination ? state.offset : 0,
      }, state.sort, state.chips));
      if (Array.isArray(response)) {
        response.length > state.limit && console.warn("List rows count is more than it's capacity");
        return {
          rows: response.slice(0, state.limit),
          total: null,
        };
      } else {
        const { rows = [], total = null } = response || {};
        rows.length > state.limit && console.warn("List rows count is more than it's capacity");
        return { rows: rows.slice(0, state.limit), total };
      }
    } else {
      if (Array.isArray(handler)) {
        return {
          rows: handler.slice(state.offset, state.limit + state.offset),
          total: handler.length,
        };
      } else {
        const { rows = [], total = null } = handler || {};
        return {
          rows: rows.slice(state.offset, state.limit + state.offset),
          total,
        };
      }
    }
  }, [state, handler]);

  const handleFilter = useCallback(async (filterData: FilterData, keepPagination = false) => {
    setLoading(true);
    try {
      const {
        rows,
        total,
      } = await handleRows(filterData, keepPagination);
      if (!keepPagination) {
        scrollManager.scrollTop();
      }
      isMounted.current && setState((prevState) => ({
        ...prevState,
        initComplete: true,
        loading: false,
        filterData,
        rows,
        total,
        ...(!keepPagination && {
          offset: 0,
        }),
      }));
    } catch (e) {
      fallback(e as Error);
    } finally {
      setLoading(false);
      onFilterChange(filterData);
    }
  }, [state]);

  const handleDefault = useCallback(() => {
    const newData: Partial<FilterData> = {};
    deepFlat(filters)
      .filter(({ name }) => !!name)
      .map(({ type, name }) => {
        set(newData, name, initialValue(type));
      });
    handleFilter(newData as FilterData);
    selectionApiRef.current?.reload(true);
  }, [filters, state.sort, state.chips]);

  const handleReload = useCallback(async (keepSelection = false) => {
    await handleFilter(state.filterData, true);
    !keepSelection && selectionApiRef.current?.reload();
  }, [state]);

  useEffect(() => {
    const hasFilters = Array.isArray(filters) && !!filters.length;
    if (!hasFilters) {
      handleDefault();
    }
  }, []);

  useEffect(() => {
    const instance: IListApi = {
      reload: handleReload,
    };
    if (typeof ref === 'function') {
      ref(instance);
    } else if (ref) {
      ref.current = instance;
    }
  }, [ref, state]);

  const handlePageChange = (page: number) => {
    isMounted.current && setState((prevState) => ({
      ...prevState,
      offset: page * state.limit,
    }));
  };

  const handleLimitChange = (newLimit: number) => {
    const newPage = Math.floor(state.offset / newLimit);
    isMounted.current && setState((prevState) => ({
      ...prevState,
      offset: newPage * newLimit,
      limit: newLimit,
    }));
  };

  const handleSortModel = useCallback((sort: ListHandlerSortModel) => {
    isMounted.current && setState((prevState) => ({
      ...prevState,
      offset: 0,
      sort,
    }));
    onSortModelChange(sort);
  }, [state]);

  const handleChips = useCallback((chips: ListHandlerChips) => {
    isMounted.current && setState((prevState) => ({
      ...prevState,
      offset: 0,
      chips,
    }));
    onChipsChange(chips);
  }, [state]);

  const handleSearch = useCallback((search: string) => {
    isMounted.current && setState((prevState) => ({
      ...prevState,
      offset: 0,
      search,
    }));
    onSearchChange(search);
  }, [state]);

  useEffect(() => {
    if (state.initComplete) {
      handleReload(true);
    }
  }, [state.limit, state.offset]);

  useEffect(() => {
    if (state.initComplete) {
      handleFilter(state.filterData, false);
      selectionApiRef.current?.reload();
    }
  }, [state.sort, state.chips, state.search]);

  const handleFiltersCollapsed = (filtersCollapsed: boolean) => setFiltersCollapsed(filtersCollapsed);

  const callbacks: IListCallbacks<FilterData, RowData> = {
    handlePageChange,
    handleLimitChange,
    handleSortModel,
    handleDefault,
    handleFilter,
    handleReload,
    handleChips,
    handleSearch,
    handleFiltersCollapsed,
    ready: handleDefault,
  };

  const renderInner = () => {
    if (isChooser) {
      return (
        <ChooserView<FilterData, RowData>
          {...props}
          {...state}
          handler={handler}
          filters={filters}
          columns={columns}
          actions={actions}
          limit={state.limit}
          offset={state.offset}
          listChips={upperChips}
          {...callbacks}
        />
      );
    } else {
      return (
        <GridView<FilterData, RowData>
          {...props}
          {...state}
          handler={handler}
          filters={filters}
          columns={columns}
          actions={actions}
          limit={state.limit}
          offset={state.offset}
          listChips={upperChips}
          {...callbacks}
        />
      );
    }
  };

  return (
    <ThemeProvider>
      <PropProvider {...{ ...props, ...state, ...callbacks }}>
        <SelectionProvider ref={selectionApiRef} selectedRows={selectedRows}>
          <CachedRowsProvider>
            <SortModelProvider sortModel={upperSortModel}>
              <ChipsProvider chips={upperChips}>
                <ModalSortProvider>
                  {renderInner()}
                </ModalSortProvider>
              </ChipsProvider>
            </SortModelProvider>
          </CachedRowsProvider>
        </SelectionProvider>
      </PropProvider>
    </ThemeProvider>
  );

};

export const List = forwardRef(ListInternal) as typeof ListInternal;

const ListTypedInternal = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  >(
    props: IListProps<FilterData, RowData, TypedField<FilterData>>,
    ref: any
  ) => <List<FilterData, RowData> ref={ref} {...props} />;

export const ListTyped = forwardRef(ListTypedInternal) as typeof ListTypedInternal;

(List as any).typed = ListTyped;

export default List;
