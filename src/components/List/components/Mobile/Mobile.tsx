import * as React from "react";
import { useRef, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';

import { FixedSizeList, ListOnScrollProps } from "react-window";

import deepCompare from '../../../../utils/deepCompare';

import IListProps, { IListState, IListCallbacks } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import ListItem from "./ListItem";

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

export const Mobile = <
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
>(props: IMobileProps<FilterData, RowData>) => {

  const innerRef = useRef<HTMLElement>(null);
  const classes = useStyles();

  const {
    rows: upperRows,
    filterData: upperFilterData,
    rowHeight,
    offset,
    limit,
    total,
    loading,
  } = props;

  const {
    handlePageChange,
  } = props;

  const [state, setState] = useState<IMobileState>({
    rows: upperRows,
    filterData: upperFilterData,
  });

  const handleMergeRows = useCallback(() => setState(({
    rows,
    filterData,
  }) => {
    const rowMap = new Map(rows.map((row) => [row.id, row]));
    upperRows.forEach((row) => rowMap.set(row.id, row));
    return {
      filterData,
      rows: [...rowMap.values()],
    };
  }), [upperRows]);

  const handleCleanRows = useCallback(() => setState(() => ({
    rows: upperRows,
    filterData: upperFilterData,
  })), [upperRows, upperFilterData]);

  const handleAppendRows = useCallback(() => setState((state) => ({
    ...state,
    rows: [...state.rows, ...upperRows],
  })), [state, upperRows]);

  const handlePaginate = useCallback(() => {
    if (!deepCompare(state.filterData, upperFilterData)) {
      handleCleanRows();
    } else {
      handleMergeRows();
    }
  }, [state, upperRows, upperFilterData]);

  useEffect(() => handleAppendRows(), [upperRows]);
  useEffect(() => handlePaginate(), [upperFilterData]);

  const createScrollHandler = (height: number) => ({
    scrollDirection,
    scrollOffset,
  }: ListOnScrollProps) => {
    if (scrollDirection === 'forward') {
      const { current } = innerRef;
      if (current && !loading) {
        const { height: scrollHeight } = current.getBoundingClientRect();
        const pendingPage = Math.floor(offset / limit) + 1;
        if (height + scrollOffset === scrollHeight) {
          if (!total || pendingPage * limit < total) {
            handlePageChange(pendingPage);
          }
        }
      }
    }
  };

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
          {({ index, style }) => (
            <ListItem
              key={index}
              row={rows[index]}
              rows={rows}
              style={style}
            />
          )} 
        </FixedSizeList>
      )}
    </Container>
  )
};

export default Mobile;
