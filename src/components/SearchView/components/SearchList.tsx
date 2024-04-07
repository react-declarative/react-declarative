import * as React from "react";
import { useState, useCallback, useLayoutEffect, useRef } from "react";

import { makeStyles } from "../../../styles";

import VirtualView from "../../VirtualView";

import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import ISearchItem from "../model/ISearchItem";
import IAnything from "../../../model/IAnything";
import ISearchItemProps from "../model/ISearchItemProps";
import ICreateButtonProps from "../model/ICreateButtonProps";

import { SEARCH_VIEW_ROOT } from "../config";

/**
 * Interface for the props of the SearchList component.
 */
interface ISearchListProps {
  value: string;
  items: ISearchItem[];
  item: ISearchItem | null;
  loading: boolean;
  hasMore: boolean;
  payload: IAnything;
  SearchItem: React.ComponentType<ISearchItemProps>;
  CreateButton: React.ComponentType<ICreateButtonProps>;
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

/**
 * Represents a searchable list component.
 * @typedef ISearchListProps
 * @property value - The current value of the search list.
 * @property items - An array of items to be displayed in the list.
 * @property item - The currently selected item in the list.
 * @property payload - Additional data payload for the search list.
 * @property loading - Indicates if the search list is currently in a loading state.
 * @property hasMore - Indicates if there are more items available to load.
 * @property SearchItem - The component used to display each item in the list.
 * @property CreateButton - The component used to create a new item in the list.
 * @property onItemChange - Callback function called when an item in the list is changed.
 * @property onDataRequest - Callback function called when more data is requested to be loaded.
 * @property onCreate - Callback function called when a new item is created.
 * @property onLoadStart - Callback function called when the loading state starts.
 * @property onLoadEnd - Callback function called when the loading state ends.
 * @property fallback - The component to be rendered when there are no items in the list.
 * @property throwError - The component to be rendered when an error occurs.
 */
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

  /**
   * A callback function triggered when the loading starts.
   * It increments the current loading count and calls the onLoadStart function if provided.
   */
  const handleLoadStart = useCallback(() => {
    setCurrentLoading((currentLoading) => currentLoading + 1);
    onLoadStart && onLoadStart();
  }, []);

  /**
   * Handle the end of a load operation.
   * @param isOk - Indicates if the load was successful.
   */
  const handleLoadEnd = useCallback((isOk: boolean) => {
    setCurrentLoading((currentLoading) => currentLoading - 1);
    onLoadEnd && onLoadEnd(isOk);
  }, []);

  const loading = upperLoading || !!currentLoading;

  useLayoutEffect(() => {
    const { current } = rootRef;
    const root = current?.closest(`.${SEARCH_VIEW_ROOT}`);
    const input = root?.querySelector("input");
    setText(input?.value || "");
  }, [loading]);

  /**
   * Render a loader component.
   *
   * @returns The rendered loader component.
   *
   * @param onCreate - The callback function to invoke when creating an item.
   * @param classes - The CSS classes to apply to the rendered component.
   * @param loading - Indicates if the loader is currently loading.
   * @param item - The item to be rendered.
   * @param items - The items to be rendered.
   */
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

  /**
   * Renders the create button if all conditions are met.
   * @returns The rendered create button, or null if conditions are not met.
   * @param onCreate - The callback function to be executed when the create button is clicked.
   * @param text - The text input value.
   * @param item - A flag indicating if an item is present.
   * @param items - An array containing items.
   * @param loading - A flag indicating if data is being loaded.
   * @param classes - The CSS classes object.
   * @param payload - The payload object.
   */
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
        <CreateButton payload={payload} search={text} />
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
