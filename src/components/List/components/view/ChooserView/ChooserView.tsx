import * as React from "react";
import { useRef, useState, useEffect, useCallback } from 'react';

import { makeStyles } from '../../../../../styles';

import { FixedSizeList, ListOnScrollProps } from "react-window";

import Box from '@mui/material/Box';
import MatListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import NotInterested from '@mui/icons-material/NotInterested';

import IListProps, { IListState, IListCallbacks } from '../../../../../model/IListProps';
import IAnything from '../../../../../model/IAnything';
import IRowData from '../../../../../model/IRowData';

import classNames from "../../../../../utils/classNames";

import ModalLoader from "./components/ModalLoader";
import ListItem from "./components/ListItem";

import Container from "../../Container";

const DEFAULT_ITEM_SIZE = 75;
const SCROLL_DELTA = 10;

export const MOBILE_LIST_ROOT = "react-declarative__mobileListRoot";

const useStyles = makeStyles()((theme) => ({
  root: {
    background: theme.palette.background.paper,
  },
  empty: {
    position: 'absolute',
    zIndex: 999,
    top: 0,
    left: 0,
    right: 0,
  },
}));

interface IChooserProps<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> extends
  Omit<IListProps<FilterData, RowData>, keyof {
    ref: never;
    limit: never;
    chips: never;
    search: never;
    filterData: never;
    isChooser: never;
  }>,
  IListState<FilterData, RowData>,
  IListCallbacks<FilterData, RowData> {
  className?: string;
  style?: React.CSSProperties;
  listChips: IListProps['chips'];
}

interface IChooserState<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> {
  rows: IChooserProps<FilterData, RowData>["rows"];
  filterData: IChooserProps<FilterData, RowData>["filterData"];
};

export const Chooser = <
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  >(props: IChooserProps<FilterData, RowData>) => {

  const innerRef = useRef<HTMLElement>(null);
  const outerRef = useRef<HTMLElement>(null);

  const { classes } = useStyles();

  const {
    rows: upperRows,
    filterData: upperFilterData,
    offset,
    limit,
    total,
    loading,
    withLoader = false,
  } = props;

  const {
    handlePageChange,
  } = props;

  const [state, setState] = useState<IChooserState>({
    rows: upperRows,
    filterData: upperFilterData,
  });

  const handleCleanRows = useCallback(() => {
    const { current } = outerRef;
    setState(() => ({
      rows: upperRows,
      filterData: upperFilterData,
    }));
    current && current.scrollTo(current.scrollLeft || 0, 0);
  }, [upperRows, upperFilterData]);

  const handleAppendRows = useCallback(() => setState(({
    rows,
    ...state
  }) => {
    const rowIds = new Set(rows.map(({ id }) => id));
    return {
      ...state,
      rows: [...rows, ...upperRows.filter(({ id }) => !rowIds.has(id))],
    };
  }), [state, upperRows]);

  useEffect(() => handleAppendRows(), [upperRows]);
  useEffect(() => handleCleanRows(), [upperFilterData]);

  const createScrollHandler = (height: number) => ({
    scrollDirection,
    scrollOffset,
  }: ListOnScrollProps) => {
    if (scrollDirection === 'forward') {
      const { current } = innerRef;
      if (current && !loading) {
        const { height: scrollHeight } = current.getBoundingClientRect();
        const pendingPage = Math.floor(offset / limit) + 1;
        if (Math.ceil(height + scrollOffset) + SCROLL_DELTA >= scrollHeight && scrollHeight !== 0) {
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
      {({ height, width, payload: { rows, loading } }) => (
        <Box position="relative" style={{ height, width }}>
          <ModalLoader open={withLoader && loading} />
          {!loading && rows.length === 0 ? (
            <MatListItem className={classes.empty}>
              <ListItemIcon>
                <NotInterested />
              </ListItemIcon>
              <ListItemText
                primary="Empty"
                secondary="Nothing found"
              />
            </MatListItem>
          ) : (
            <FixedSizeList
              className={classNames(classes.root, MOBILE_LIST_ROOT)}
              height={height}
              width={width}
              itemCount={rows.length}
              onScroll={createScrollHandler(height)}
              innerRef={innerRef}
              outerRef={outerRef}
              itemSize={DEFAULT_ITEM_SIZE}
            >
              {({ index, style }) => (
                <ListItem
                  key={index}
                  row={rows[index]}
                  style={style}
                />
              )}
            </FixedSizeList>
          )}
        </Box>
      )}
    </Container>
  )
};

export default Chooser;
