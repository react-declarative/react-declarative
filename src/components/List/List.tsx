import * as React from 'react';
import { forwardRef } from 'react';
import { useState, useCallback, useLayoutEffect } from 'react';

import IListProps, { IListState, ListHandlerResult } from '../../model/IListProps';
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

const DEFAULT_LIMIT = 50;

/*
 * TODO:
 * https://github.com/mui-org/material-ui-x/pull/2117
 */
export const ListInternal = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  Field extends IField = IField<IAnything>,
>(props: IListProps<FilterData, RowData, Field>, ref: any) => {

  const {
    handler = () => [],
    fallback = () => null,
    limit: defaultLimit = DEFAULT_LIMIT,
    filters = [],
    columns = [],
    actions = [],
  } = props;

  const [state, setState] = useState<IListState<FilterData, RowData>>({
    initComplete: false,
    isMobile: false,
    filterData: {} as never,
    rows: [] as never,
    rowHeight: DEFAULT_ROW_HEIGHT,
    uniqueKey: randomString(),
    limit: defaultLimit,
    offset: 0,
    total: null,
    loading: false,
  });

  const setLoading = (loading: boolean) => setState((prevState) => ({...prevState, loading}));

  const { isMobile } = state;

  const calcRowHeight = useHeightCalc<RowData>(columns);

  const handleRows = async (filterData: FilterData): Promise<{
    rows: RowData[];
    total: number | null;
  }> => {
    const response: ListHandlerResult<RowData> = typeof handler === 'function'
      ? (await Promise.resolve(handler(filterData, {
        limit: state.limit,
        offset: state.offset,
      })))
      : handler;
    if (Array.isArray(response)) {
      return {
        rows: response,
        total: null,
      };
    } else {
      const { rows = [], total = null } = response || {};
      return { rows, total };
    }
  };

  const handleFilter = async (filterData: FilterData, keepPagination = false) => {
    setLoading(true);
    try {
      const {
        rows,
        total,
      } = await handleRows(filterData);
      if (!deepCompare(rows, state.rows)) {
        const rowHeight = calcRowHeight(rows);
        setState((prevState) => ({
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
      fallback(e);
    } finally {
      setLoading(false);
    }
  };

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
    if (!hasFilters) {
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
      setState((prevState) => ({
        ...prevState,
        offset: page * state.limit,
      }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (state.total !== null) {
      const newPage = Math.floor(state.offset / newLimit);
      setState((prevState) => ({
        ...prevState,
        offset: newPage * newLimit,
        limit: newLimit,
      }));
    }
  };

  useLayoutEffect(() => {
    if (state.total !== null) {
      handleReload();
    }
  }, [state.limit, state.offset]);

  return (
    <PropProvider {...{...props, ...state}}>
      {isMobile ? (
        <Mobile<FilterData, RowData>
          {...props}
          {...state}
          handler={handler}
          filters={filters}
          columns={columns}
          actions={actions}
          handlePageChange={handlePageChange}
          handleLimitChange={handleLimitChange}
          handleDefault={handleDefault}
          handleFilter={handleFilter}
          ready={handleDefault}
        />
      ) : (
        <Desktop<FilterData, RowData>
          {...props}
          {...state}
          handler={handler}
          filters={filters}
          columns={columns}
          actions={actions}
          handlePageChange={handlePageChange}
          handleLimitChange={handleLimitChange}
          handleDefault={handleDefault}
          handleFilter={handleFilter}
          ready={handleDefault}
          limit={state.limit}
        />
      )}
    </PropProvider>
  );

};

export const List = forwardRef(ListInternal) as typeof ListInternal;

export const ListTyped = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  >(
    props: IListProps<FilterData, RowData, TypedField<FilterData>>
  ) => <List<FilterData, RowData> {...props} />;

(List as any).typed = ListTyped;

export default List;
