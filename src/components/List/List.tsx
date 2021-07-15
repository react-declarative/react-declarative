import * as React from 'react';
import { useState, useLayoutEffect } from 'react';

import IListProps, { IListState } from '../../model/IListProps';
import TypedField from '../../model/TypedField';
import IAnything from '../../model/IAnything';
import IRowData from '../../model/IRowData';

import initialValue from '../../config/initialValue';
import deepFlat from '../../utils/deepFlat';
import set from '../../utils/set';

import Mobile from './components/Mobile';
import Desktop from './components/Desktop';

import createRowHeightHandler, { DEFAULT_ROW_HEIGHT } from "./components/Desktop/createRowHeightHandler";

export const List = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
>(props: IListProps<FilterData, RowData>) => {

  const {
    handler = () => [],
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
  });

  const { isMobile, rowHeight } = state;

  const handleRowHeight = createRowHeightHandler<RowData>({
    setHeight: (rowHeight) => setState((prevState) => ({...prevState, rowHeight})),
    columns,
  });

  const handleFilter = async (filterData: FilterData) => {
    const rows = (await Promise.resolve(handler(filterData))) as RowData[];
    handleRowHeight(rows);
    setState({
      initComplete: true,
      isMobile,
      filterData,
      rows,
      rowHeight,
    });
  };

  const handleDefault = () => {
    const newData: Partial<FilterData> = {};
    deepFlat(filters)
      .filter(({name}) => !!name)
      .map(({ type, name }) => {
        set(newData, name, initialValue(type));
      });
    handleFilter(newData as FilterData);
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      handleDefault();
    }, 1);
  }, [handler]);

  return isMobile ? (
    <Mobile<FilterData, RowData>
      {...props}
      {...state}
      handler={handler}
      filters={filters}
      columns={columns}
      actions={actions}
      handleDefault={handleDefault}
      handleFilter={handleFilter}
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
    />
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
