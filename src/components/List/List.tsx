import * as React from 'react';
import { useState, useLayoutEffect } from 'react';

import IListProps, { IListState } from '../../model/IListProps';
import TypedField from '../../model/TypedField';
import IAnything from '../../model/IAnything';
import IRowData from '../../model/IRowData';
import IField from '../../model/IField';

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

export const List = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  Field extends IField = IField<IAnything>,
>(props: IListProps<FilterData, RowData, Field>) => {

  const {
    handler = () => [],
    fallback = () => null,
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
  });

  const { isMobile } = state;

  const calcRowHeight = useHeightCalc<RowData>(columns);

  const handleFilter = async (filterData: FilterData) => {
    try {
      const rows = typeof handler === 'function'
        ? (await Promise.resolve(handler(filterData))) as RowData[]
        : handler;
      if (!deepCompare(rows, state.rows)) {
        const rowHeight = calcRowHeight(rows);
        setState((prevState) => ({
          ...prevState,
          initComplete: true,
          filterData,
          rows,
          rowHeight,
        }));
      }
    } catch (e) {
      fallback(e);
    }
  };

  const handleDefault = () => {
    const newData: Partial<FilterData> = {};
    deepFlat(filters)
      .filter(({ name }) => !!name)
      .map(({ type, name }) => {
        set(newData, name, initialValue(type));
      });
    handleFilter(newData as FilterData);
  };

  useLayoutEffect(() => {
    const hasFilters = Array.isArray(filters) && !!filters.length ;
    if (!hasFilters) {
      setTimeout(handleDefault);
    }
  }, [filters]);

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
          handleDefault={handleDefault}
          handleFilter={handleFilter}
          ready={handleDefault}
        />
      )}
    </PropProvider>
  );

};

export const ListTyped = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  >(
    props: IListProps<FilterData, RowData, TypedField<FilterData>>
  ) => <List<FilterData, RowData> {...props} />;

List.typed = ListTyped;

export default List;
