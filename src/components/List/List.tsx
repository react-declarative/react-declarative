import * as React from 'react';
import { forwardRef } from 'react';
import { useState, useCallback, useLayoutEffect, useRef } from 'react';

import IListProps, { IListCallbacks, IListState, ListHandlerResult, ListHandlerSortModel } from '../../model/IListProps';
import TypedField from '../../model/TypedField';
import IAnything from '../../model/IAnything';
import IRowData from '../../model/IRowData';
import IField from '../../model/IField';
import IListApi from '../../model/IListApi';

import initialValue from '../../config/initialValue';
import deepFlat from '../../utils/deepFlat';
import set from '../../utils/set';

import Mobile from './components/Mobile';
import Desktop from './components/Desktop';

import { DEFAULT_ROW_HEIGHT } from "./components/Desktop/createRowHeightCalc";
import useHeightCalc from './components/Desktop/hooks/useHeightCalc';
import PropProvider from './components/PropProvider';

import randomString from '../../utils/randomString';
import deepCompare from '../../utils/deepCompare';
import objects from '../../utils/objects';

import DisplayMode from '../../model/DisplayMode';

const DEFAULT_LIMIT = 50;
const DEFAULT_AUTORELOAD_INTERVAL = 30_000;

const ListInternal = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  Field extends IField = IField<IAnything>,
>(props: IListProps<FilterData, RowData, Field>, ref: any) => {

  const isMounted = useRef(true);

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
  } = props;

  const [state, setState] = useState<IListState<FilterData, RowData>>({
    initComplete: false,
    isMobile: displayMode === DisplayMode.Mobile,
    filterData: {} as never,
    rows: [] as never,
    rowHeight: DEFAULT_ROW_HEIGHT,
    uniqueKey: randomString(),
    limit: defaultLimit,
    offset: 0,
    total: null,
    loading: false,
    autoReload: defaultAutoReload,
    sort: [],
  });

  const setLoading = (loading: boolean) => isMounted.current && setState((prevState) => ({...prevState, loading}));

  const setMobile = (isMobile: boolean) => isMounted.current && setState((prevState) => ({...prevState, isMobile}));

  const setAutoReload = (autoReload: boolean) => isMounted.current && setState((prevState) => ({...prevState, autoReload}));

  const { isMobile } = state;

  const calcRowHeight = useHeightCalc<RowData>(columns);

  useLayoutEffect(() => {
    setMobile(displayMode !== DisplayMode.Desktop);
  }, [displayMode]);

  const handleRows = async (filterData: FilterData): Promise<{
    rows: RowData[];
    total: number | null;
  }> => {
    const response: ListHandlerResult<RowData> = typeof handler === 'function'
      ? (await Promise.resolve(handler(filterData, {
        limit: state.limit,
        offset: state.offset,
      }, state.sort)))
      : handler;
    if (Array.isArray(response)) {
      return {
        rows: [...response],
        total: null,
      };
    } else {
      const { rows = [], total = null } = response || {};
      return { rows: [...rows], total };
    }
  };

  const handleFilter = useCallback(async (filterData: FilterData, keepPagination = false) => {
    setLoading(true);
    try {
      const {
        rows,
        total,
      } = await handleRows(filterData);
      if (!deepCompare(objects(rows), objects(state.rows)) || rows.length === 0) {
        const rowHeight = calcRowHeight(rows);
        isMounted.current && setState((prevState) => ({
          ...prevState,
          initComplete: true,
          filterData,
          rows,
          total,
          rowHeight,
          ...(!keepPagination && {
            offset: 0,
          }),
        }));
      }
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

  const handleReload = useCallback(() => handleFilter(state.filterData, true), [state]);

  useLayoutEffect(() => {
    const hasFilters = Array.isArray(filters) && !!filters.length;
    if (!hasFilters && !state.initComplete) {
      setTimeout(handleDefault);
    }
  }, [filters]);

  useLayoutEffect(() => {
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
    if (state.total !== null) {
      isMounted.current && setState((prevState) => ({
        ...prevState,
        offset: page * state.limit,
      }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (state.total !== null) {
      const newPage = Math.floor(state.offset / newLimit);
      isMounted.current && setState((prevState) => ({
        ...prevState,
        offset: newPage * newLimit,
        limit: newLimit,
      }));
    }
  };

  const handleSortModel = useCallback((sort: ListHandlerSortModel) => {
    if (!deepCompare(objects(state.sort), objects(sort))) {
      isMounted.current && setState((prevState) => ({
        ...prevState,
        sort,
      }));
      onSortModelChange(sort);
    }
  }, [state]);

  useLayoutEffect(() => {
    if (state.initComplete) {
      handleReload();
    }
  }, [state.limit, state.offset, state.sort]);

  useLayoutEffect(() => {
    let timeout: any = null;
    if (state.autoReload && !state.loading) {
      timeout = setTimeout(() => {
        timeout = null;
        handleReload();
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

  const callbacks: IListCallbacks<FilterData, RowData> = {
    handlePageChange,
    handleLimitChange,
    handleSortModel,
    handleDefault,
    handleFilter,
    handleReload,
    handleSetMobile,
    handleAutoReload,
    ready: handleDefault,
  };

  return (
    <PropProvider {...{...props, ...state, ...callbacks}}>
      {isMobile ? (
        <Mobile<FilterData, RowData>
          {...props}
          {...state}
          handler={handler}
          filters={filters}
          columns={columns}
          actions={actions}
          {...callbacks}
        />
      ) : (
        <Desktop<FilterData, RowData>
          {...props}
          {...state}
          handler={handler}
          filters={filters}
          columns={columns}
          actions={actions}
          limit={state.limit}
          {...callbacks}
        />
      )}
    </PropProvider>
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
