import * as React from 'react';
import { useState, useLayoutEffect } from 'react';

import IListProps, { IRowData, IListState, ListHandler } from '../../model/IListProps';
import TypedField from '../../model/TypedField';
import IAnything from '../../model/IAnything';

import initialValue from '../../config/initialValue';
import deepFlat from '../../utils/deepFlat';
import set from '../../utils/set';

import Mobile from './components/Mobile';
import Desktop from './components/Desktop';

export const List = <
  FilterData extends IRowData = IAnything,
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
  });

  const { isMobile } = state;

  const handleFilter = async (filterData: FilterData) => {
    const rows = (await Promise.resolve(handler(filterData))) as RowData[];
    setState({
      initComplete: true,
      isMobile,
      filterData,
      rows,
    });
  };

  const handleDefault: ListHandler<FilterData, RowData>  = () => {
    const newData: Partial<FilterData> = {};
    deepFlat(filters).map(({ type, name }) => {
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
  FilterData extends IRowData = IAnything,
  RowData extends IRowData = IAnything,
>(
  props: IListProps<FilterData, RowData, TypedField<FilterData>>
) => <List<FilterData, RowData> {...props} />;

List.typed = ListTyped;

export default List;
