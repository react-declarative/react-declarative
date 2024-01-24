import * as React from "react";
import { useState, useCallback } from "react";

import { makeStyles } from "../../../styles";

import VirtualView from "../../VirtualView";

import MenuItem from "@mui/material/MenuItem";

import ISearchItem from "../model/ISearchItem";

interface ISearchListProps {
  value: string;
  items: ISearchItem[];
  item: ISearchItem | null;
  loading: boolean;
  hasMore: boolean;
  onItemChange: (item: ISearchItem) => void;
  onDataRequest: (initial: boolean) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (error: Error) => void;
  throwError?: boolean;
}

const ITEM_HEIGHT = 60;
const ITEM_BUFFERSIZE = 25;
const MAX_ITEMS_COUNT = 4;

const useStyles = makeStyles()({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    height: ITEM_HEIGHT * MAX_ITEMS_COUNT,
    width: "100%",
  },
  item: {
    whiteSpace: "break-spaces",
  },
});

export const SearchList = ({
  value,
  items,
  item,
  loading: upperLoading,
  hasMore,
  onItemChange,
  onDataRequest,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError,
}: ISearchListProps) => {
  const { classes } = useStyles();

  const [currentLoading, setCurrentLoading] = useState(0);

  const handleLoadStart = useCallback(() => {
    setCurrentLoading((currentLoading) => currentLoading + 1);
    onLoadStart && onLoadStart();
  }, []);

  const handleLoadEnd = useCallback((isOk: boolean) => {
    setCurrentLoading((currentLoading) => currentLoading - 1);
    onLoadEnd && onLoadEnd(isOk);
  }, []);

  const loading = upperLoading || !!currentLoading;

  return (
    <VirtualView
      key={`${value}-${item?.value}`}
      className={classes.root}
      onDataRequest={onDataRequest}
      onLoadStart={handleLoadStart}
      onLoadEnd={handleLoadEnd}
      fallback={fallback}
      throwError={throwError}
      loading={loading}
      hasMore={hasMore}
      minRowHeight={ITEM_HEIGHT}
      bufferSize={ITEM_BUFFERSIZE}
    >
      {item && (
        <MenuItem
          className={classes.item}
          disabled
          key={item.value}
          value={item.value}
        >
          {item.label}
        </MenuItem>
      )}
      {!item && !items.length && (
        <MenuItem className={classes.item} disabled>
          {loading ? "Loading" : "Nothing found"}
        </MenuItem>
      )}
      {items
        .filter(({ value }) => value !== item?.value)
        .map((item) => (
          <MenuItem
            className={classes.item}
            key={item.value}
            value={item.value}
            onClick={() => {
              onItemChange(item);
            }}
          >
            {item.label}
          </MenuItem>
        ))}
    </VirtualView>
  );
};

export default SearchList;
