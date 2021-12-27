import * as React from "react";
import { useRef, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';

import { FixedSizeList, ListOnScrollProps } from "react-window";

import deepCompare from '../../../../utils/deepCompare';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import Async from '../../../common/Async';

import IListProps, { IListState, IListCallbacks } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';
import IColumn from "../../../../model/IColumn";

import Container from "../Container";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
  },
}));

interface IMobileProps<FilterData = IAnything, RowData extends IRowData = IAnything> extends
  Omit<IListProps<FilterData, RowData>, keyof {
    ref: never;
    limit: never;
    autoReload: never;
  }>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
}

interface IMobileState<FilterData = IAnything, RowData extends IRowData = IAnything> {
  rows: IMobileProps<FilterData, RowData>["rows"];
  filterData: IMobileProps<FilterData, RowData>["filterData"];
};

const AsyncText = <RowData extends IRowData = IAnything>({
  row,
  fallback,
  column,
}: {
  row: RowData;
  fallback: IListProps['fallback'];
  column?: IColumn<RowData>;
}) => (
  <Async fallback={fallback}>
    {() => {
      if (column && column.compute) {
        return column.compute(row);
      } else if (column && column.field) {
        return row[column.field];
      } else {
        return 'empty';
      }
    }}
  </Async>
);

export const Mobile = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
>(props: IMobileProps<FilterData, RowData>) => {

  const innerRef = useRef<HTMLElement>(null);
  const classes = useStyles();

  const {
    rows: upperRows,
    filterData: upperFilterData,
    fallback = () => null,
    columns = [],
    rowHeight,
    offset,
    limit,
    loading,
  } = props;

  const {
    handlePageChange,
  } = props;

  const [state, setState] = useState<IMobileState>({
    rows: upperRows,
    filterData: upperFilterData,
  });

  const handleFilterData = useCallback(() => {
    if (!deepCompare(state.filterData, upperFilterData)) {
      setState(() => ({
        rows: upperRows,
        filterData: upperFilterData,
      }));
    }
  }, [state, upperRows, upperFilterData]);

  useEffect(() => setState((state) => ({
    ...state,
    rows: [...state.rows, ...upperRows],
  })), [upperRows]);

  useEffect(() => handleFilterData(), [upperFilterData]);

  const createScrollHandler = (height: number) => ({
    scrollDirection,
    scrollOffset,
  }: ListOnScrollProps) => {
    if (scrollDirection === 'forward') {
      const { current } = innerRef;
      if (current && !loading) {
        const { height: scrollHeight } = current.getBoundingClientRect();
        const currentPage = Math.floor(offset / limit);
        if (height + scrollOffset === scrollHeight) {
          handlePageChange(currentPage + 1);
          console.log('inc')
        }
      }
    }
  };

  const primaryColumn = columns.find(({ primary }) => primary) || columns.find(({ field }) => !!field);
  const secondaryColumn = columns.find(({ secondary }) => secondary);

  console.log(state.rows, primaryColumn, secondaryColumn);

  return (
    <Container<FilterData, RowData>
      {...props}
      {...state}
    >
      {({ height, width, payload: { rows } }) => (
        <FixedSizeList
          className={classes.root}
          height={height}
          width={width}
          itemCount={rows.length}
          onScroll={createScrollHandler(height)}
          innerRef={innerRef}
          itemSize={rowHeight}
        >
          {({ index, style }) => {
            const primary = (
              <AsyncText<RowData>
                row={rows[index]}
                fallback={fallback}
                column={primaryColumn}
              />
            );
            const secondary = (
              <AsyncText<RowData>
                row={rows[index]}
                fallback={fallback}
                column={secondaryColumn}
              />
            );
            return (
              <ListItem
                key={index}
                style={style}
              >
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={primary}
                  secondary={secondary}
                />
              </ListItem>
            );
          }} 
        </FixedSizeList>
      )}
    </Container>
  )
};

export default Mobile;
