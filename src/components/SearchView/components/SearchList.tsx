import * as React from "react";
import { useState, useCallback, useLayoutEffect, useRef } from "react";

import { makeStyles } from "../../../styles";

import VirtualView from "../../VirtualView";

import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import ISearchItem from "../model/ISearchItem";
import IAnything from "../../../model/IAnything";
import ISearchItemProps from "../model/ISearchItemProps";

import { SEARCH_VIEW_ROOT } from "../config";

interface ISearchListProps {
  value: string;
  items: ISearchItem[];
  item: ISearchItem | null;
  loading: boolean;
  hasMore: boolean;
  payload: IAnything;
  SearchItem: React.ComponentType<ISearchItemProps>;
  CreateButton: React.ComponentType<{}>;
  onItemChange: (item: ISearchItem) => void;
  onDataRequest: (initial: boolean) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  fallback?: (error: Error) => void;
  onCreate?: (value: string) => void;
  throwError?: boolean;
}

const ITEM_HEIGHT = 45;
const ITEM_BUFFERSIZE = 25;
const MAX_ITEMS_COUNT = 8;

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
  stretch: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *:nth-of-type(1)": {
      flex: 1,
    },
  },
});

export const SearchList = ({
  value,
  items,
  item,
  payload,
  loading: upperLoading,
  hasMore,
  SearchItem,
  CreateButton,
  onItemChange,
  onDataRequest,
  onCreate,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError,
}: ISearchListProps) => {
  const { classes } = useStyles();

  const rootRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState("");

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

  useLayoutEffect(() => {
    const { current } = rootRef;
    const root = current?.closest(`.${SEARCH_VIEW_ROOT}`);
    const input = root?.querySelector("input");
    setText(input?.value || '');
  }, [loading]);

  const renderLoader = useCallback(() => {
    if (!loading && !!onCreate) {
      return null;
    }
    if (!item && !items.length) {
      return (
        <MenuItem className={classes.item} disabled>
          {loading ? "Loading" : "Nothing found"}
        </MenuItem>
      );
    }
    return null;
  }, [item, items, loading, onCreate]);

  const renderCreate = useCallback(() => {
    if (!onCreate) {
      return null;
    }
    if (!text) {
      return null;
    }
    if (item || items.length) {
      return null;
    }
    if (loading) {
      return null;
    }
    return (
      <div
        className={classes.stretch}
        onClick={() => {
          onCreate(text);
        }}
      >
        <CreateButton />
      </div>
    );
  }, [item, items, loading, text, onCreate]);

  return (
    <Box ref={rootRef} p={1}>
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
          <div className={classes.stretch}>
            <SearchItem
              disabled
              payload={payload}
              data={item.data!}
              label={item.label}
              value={item.value}
            />
          </div>
        )}
        {renderLoader()}
        {items
          .filter(({ value }) => value !== item?.value)
          .map((item) => (
            <div
              className={classes.stretch}
              onClick={() => onItemChange(item)}
              key={item.value}
            >
              <SearchItem
                disabled={false}
                payload={payload}
                data={item.data!}
                label={item.label}
                value={item.value}
              />
            </div>
          ))}
        {renderCreate()}
      </VirtualView>
    </Box>
  );
};

export default SearchList;
