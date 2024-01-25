import * as React from "react";
import { useState, useCallback } from "react";

import { makeStyles } from "../../../styles";

import VirtualView from "../../VirtualView";

import MenuItem from "@mui/material/MenuItem";

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
    if (item || items.length) {
      return null;
    }
    if (loading) {
      return null;
    }
    return (
      <div
        onClick={({ currentTarget }) => {
          const root = currentTarget.closest(`.${SEARCH_VIEW_ROOT}`);
          const input = root?.querySelector("input");
          input && onCreate(input.value);
        }}
      >
        <CreateButton />
      </div>
    );
  }, [item, items, loading, onCreate]);

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
      {renderLoader()}
      {items
        .filter(({ value }) => value !== item?.value)
        .map((item) => (
          <div key={item.value}>
            <SearchItem
              payload={payload}
              data={item.data!}
              label={item.label}
              value={item.value}
              onClick={() => onItemChange(item)}
            />
          </div>
        ))}
      {renderCreate()}
    </VirtualView>
  );
};

export default SearchList;
