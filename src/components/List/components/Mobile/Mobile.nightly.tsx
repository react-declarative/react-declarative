import * as React from "react";
import { useRef, useState, useEffect, useCallback } from 'react';

import { makeStyles } from '../../../../styles';

import VirtualizedList, { IScrollParams, SCROLL_WRAPPER } from "../../../common/VirtualizedList";

import Box from '@mui/material/Box';
import MatListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from "@mui/material/CircularProgress";

import NotInterested from '@mui/icons-material/NotInterested';

import IListProps, { IListState, IListCallbacks } from '../../../../model/IListProps';
import IAnything from '../../../../model/IAnything';
import IRowData from '../../../../model/IRowData';

import classNames from "../../../../utils/classNames";

import ModalLoader from "./components/ModalLoader";
import ListItem from "./components/ListItem";

import Container from "../Container";

const DEFAULT_ITEM_SIZE = 75;
const SCROLL_PAGINATION_DELTA = 10;

export const MOBILE_LIST_ROOT = "react-declarative__mobileListRoot";

const useStyles = makeStyles((theme) => ({
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

  const classes = useStyles();
  
  const rootRef = useRef<HTMLDivElement>(null);

  const {
    rows: upperRows,
    filterData: upperFilterData,
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

  const [pageChanged, setPageChanged] = useState(false);

  const handleCleanRows = useCallback(() => {
    const { current } = rootRef;
    const scrollArea = current?.querySelector(`.${SCROLL_WRAPPER}`);
    setState(() => ({
      rows: upperRows,
      filterData: upperFilterData,
    }));
    scrollArea && scrollArea.scrollTo(0, 0);
  }, [upperRows, upperFilterData]);

  const handleAppendRows = useCallback(() => setState(({
    rows,
    filterData,
  }) => {
    const rowIds = new Set(rows.map(({ id }) => id));
    return {
      filterData,
      rows: [...rows, ...upperRows.filter(({ id }) => !rowIds.has(id))],
    };
  }), [state, upperRows]);

  useEffect(() => handleAppendRows(), [upperRows]);
  useEffect(() => handleCleanRows(), [upperFilterData]);

  const handleScroll = ({
    direction,
    scrollOffset,
  }: IScrollParams) => {
    if (direction === 'down' && !loading) {
      const pendingPage = Math.floor(offset / limit) + 1;
      if (scrollOffset < SCROLL_PAGINATION_DELTA) {
        if (!total || pendingPage * limit < total) {
          handlePageChange(pendingPage);
          setPageChanged(true);
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
        <Box ref={rootRef} position="relative" style={{height, width}}>
          <ModalLoader open={pageChanged && loading} />
          {!rows.length && (
            <MatListItem className={classes.empty}>
              <ListItemIcon>
                {loading ? (
                  <CircularProgress size={40} />
                ) : (
                  <NotInterested />
                )}
              </ListItemIcon>
              <ListItemText
                primary={loading ? "Loading" : "Empty"}
                secondary={loading ? "Fetching data" : "Nothing found"}
              />
            </MatListItem>
          )}
          <VirtualizedList
            className={classNames(classes.root, MOBILE_LIST_ROOT)}
            height={height}
            width={width}
            rows={rows}
            itemSize={DEFAULT_ITEM_SIZE}
            onScroll={handleScroll}
          >
            {({ index, style }) => (
              <ListItem
                key={index}
                row={rows[index]}
                style={style}
              />
            )} 
          </VirtualizedList>
        </Box>
      )}
    </Container>
  )
};

export default Mobile;
