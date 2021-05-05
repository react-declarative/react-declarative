import * as React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core';

import { DataGrid } from '@material-ui/data-grid';

import classNames from '../../utils/classNames';

import AutoSizer from '../../components/common/AutoSizer';

import IListProps from '../../model/IListProps';
import TypedField from '../../model/TypedField';
import IAnything from '../../model/IAnything';

import Actions from './Actions';
import Filters from './Filters';

const useStyles = makeStyles({
  root: {
    overflow: 'hidden',
  },
  container: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
  },
  grid: {
    flex: 1,
  },
});

export const List = <FilterData extends IAnything, RowData>({
  className,
  style,
  filters = [],
  columns = [],
  actions = [],
  heightRequest = (v) => v,
  widthRequest = (v) => v,
  handler = () => [],
}: IListProps<FilterData, RowData>) => {
  const classes = useStyles();

  const [filterData, setFilterData] = useState<FilterData>();
  const [rows, setRows] = useState<RowData[]>([]);

  const handleFilter = async (newData: FilterData) => {
    setFilterData(newData);
    const newRows = await Promise.resolve(handler(newData));
    setRows(newRows);
  };

  return (
    <AutoSizer
      className={classNames(classes.root, className)}
      style={style}
    >
      {({
        height: parentHeight,
        width: parentWidth,
      }) => {
        const height = heightRequest(parentHeight);
        const width = widthRequest(parentWidth);
        return (
          <div style={{height, width}} className={classes.container}>
            <Actions<FilterData>
              filterData={filterData!}
              actions={actions}
            />
            <Filters<FilterData>
              filterData={filterData!}
              change={handleFilter}
              filters={filters}
            />
            <DataGrid
              className={classes.grid}
              columns={columns}
              rows={rows}
            />
          </div>
        )

      }}
    </AutoSizer>
  );
};

export const ListTyped = <FilterData extends IAnything, RowData extends object>(props: IListProps<FilterData, RowData, TypedField<FilterData>>) => <List<FilterData, RowData> {...props} />;

List.typed = ListTyped;

export default List;
