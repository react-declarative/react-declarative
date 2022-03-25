import * as React from 'react';
import { forwardRef } from 'react';
import { useState, useCallback, useLayoutEffect, useEffect, useRef } from 'react';

import { ThemeProvider } from '../../styles';

import IListProps, { IListCallbacks, IListState, ListHandlerResult, ListHandlerSortModel } from '../../model/IListProps';
import TypedField from '../../model/TypedField';
import IAnything from '../../model/IAnything';
import IRowData from '../../model/IRowData';
import IField from '../../model/IField';
import IListApi from '../../model/IListApi';

import initialValue from '../../config/initialValue';
import deepFlat from '../../utils/deepFlat';
import set from '../../utils/set';

import Desktop from './components/Desktop';
import Mobile from './components/Mobile';

import { ISelectionReloadRef, SelectionProvider } from './hooks/useSelection';
import { SortModelProvider } from './hooks/useSortModel';
import { PropProvider } from './hooks/useProps';

import DisplayMode from '../../model/DisplayMode';

const DEFAULT_LIMIT = 25;
const DEFAULT_AUTORELOAD_INTERVAL = 30_000;

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
    autoReload: defaultAutoReload = !props.displayMode || props.displayMode === DisplayMode.Desktop,
    autoReloadInterval = DEFAULT_AUTORELOAD_INTERVAL,
    displayMode = DisplayMode.Desktop,
    filters = [],
    columns = [],
    actions = [],
    onSortModelChange = () => null,
    onFilterChange = () => null,
    toggleFilters = false,
  } = props;

  const [state, setState] = useState<IListState<FilterData, RowData>>({
    initComplete: false,
    isMobile: displayMode === DisplayMode.Mobile,
    filterData: {} as never,
    rows: [] as never,
    limit: defaultLimit,
    offset: 0,
    total: null,
    loading: false,
    autoReload: defaultAutoReload,
    filtersCollapsed: toggleFilters,
    sort: [],
  });

  const setLoading = (loading: boolean) => isMounted.current && setState((prevState) => ({ ...prevState, loading }));

  const setMobile = (isMobile: boolean) => isMounted.current && setState((prevState) => ({ ...prevState, isMobile, offset: 0 }));

  const setAutoReload = (autoReload: boolean) => isMounted.current && setState((prevState) => ({ ...prevState, autoReload }));

  const setFiltersCollapsed = (filtersCollapsed: boolean) => isMounted.current && setState((prevState) => ({ ...prevState, filtersCollapsed }));

  const { isMobile } = state;

  useEffect(() => {
    setMobile(displayMode !== DisplayMode.Desktop);
  }, [displayMode]);

  const handleRows = useCallback(async (filterData: FilterData, keepPagination = false): Promise<{
    rows: RowData[];
    total: number | null;
  }> => {
    if (typeof handler === 'function') {
      const response: ListHandlerResult<RowData> = await Promise.resolve(handler(filterData, {
        limit: state.limit,
        offset: keepPagination ? state.offset : 0,
      }, state.sort));
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
      isMounted.current && setState((prevState) => ({
        ...prevState,
        initComplete: true,
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
  }, [filters]);

  const handleReload = useCallback((keepSelection = false) => {
    handleFilter(state.filterData, true);
    !keepSelection && selectionApiRef.current?.reload();
  }, [state]);

  useEffect(() => {
    const hasFilters = Array.isArray(filters) && !!filters.length;
    if (!hasFilters && !state.initComplete) {
      handleDefault();
    }
  }, [filters]);

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

  useEffect(() => {
    if (state.initComplete) {
      handleReload(true);
    }
  }, [state.limit, state.offset, state.sort]);

  useEffect(() => {
    let timeout: any = null;
    if (state.autoReload && !state.loading) {
      timeout = setTimeout(() => {
        timeout = null;
        handleReload(true);
      }, autoReloadInterval);
    }
    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    }
  }, [state.autoReload, state.loading, autoReloadInterval]);

  const handleAutoReload = (autoReload: boolean) => setAutoReload(autoReload);

  const handleSetMobile = (isMobile: boolean) => setMobile(isMobile);

  const handleFiltersCollapsed = (filtersCollapsed: boolean) => setFiltersCollapsed(filtersCollapsed);

  const callbacks: IListCallbacks<FilterData, RowData> = {
    handlePageChange,
    handleLimitChange,
    handleSortModel,
    handleDefault,
    handleFilter,
    handleReload,
    handleSetMobile,
    handleAutoReload,
    handleFiltersCollapsed,
    ready: handleDefault,
  };

  const renderInner = () => {
    if (isMobile) {
      return (
        <Mobile<FilterData, RowData>
          {...props}
          {...state}
          handler={handler}
          filters={filters}
          columns={columns}
          actions={actions}
          limit={state.limit}
          offset={state.offset}
          {...callbacks}
        />
      );
    } else {
      return (
        <Desktop<FilterData, RowData>
          {...props}
          {...state}
          handler={handler}
          filters={filters}
          columns={columns}
          actions={actions}
          limit={state.limit}
          offset={state.offset}
          {...callbacks}
        />
      );
    }
  };

  return (
    <ThemeProvider>
      <PropProvider {...{ ...props, ...state, ...callbacks }}>
        <SelectionProvider ref={selectionApiRef}>
          <SortModelProvider>
            {renderInner()}
          </SortModelProvider>
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
