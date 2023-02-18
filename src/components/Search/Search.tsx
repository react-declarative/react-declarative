import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import { SxProps } from "@mui/system";

import { makeStyles } from "../../styles";

import InputLabel from "@mui/material/InputLabel";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from "@mui/icons-material/Search";

import VirtualView from "../VirtualView";

import useChangeSubject from "../../hooks/useChangeSubject";
import useActualCallback from "../../hooks/useActualCallback";
import useChange from "../../hooks/useChange";

const ITEM_HEIGHT = 60;
const MAX_ITEMS_COUNT = 4;
const DEFAULT_SKIP_STEP = 25;

interface IItem {
  value: string;
  label: string;
}

interface IState {
  searchText: string;
  skip: number;
}

interface ISearchProps
  extends Omit<
    FormControlProps,
    keyof {
      onChange: never;
    }
  > {
  handler:
    | IItem[]
    | ((search: string, skip: number) => IItem[] | Promise<IItem[]>);
  value?: string;
  sx?: SxProps;
  skipStep?: number;
  onChange: (item: IItem | null) => void;
  fallback?: (e: Error) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  throwError?: boolean;
}

const useStyles = makeStyles()({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    minHeight: `${ITEM_HEIGHT}px`,
    width: "100%",
  },
});

export const Search = ({
  handler,
  onChange,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError = false,
  skipStep = DEFAULT_SKIP_STEP,
  sx,
  ...props
}: ISearchProps) => {

  const [value, setValue] = useState<IItem | null>(null);
  const [open, setOpen] = useState(false);

  const [state, setState] = useState<IState>({
    searchText: "",
    skip: 0,
  });

  const stateChangeSubject = useChangeSubject(state);

  const { searchText, skip } = state;

  const setSkip = (skip: number) =>
    setState((prevState) => ({
      ...prevState,
      skip,
    }));

  const setSearchText = (searchText: string) =>
    setState((prevState) => ({
      ...prevState,
      searchText,
    }));

  const [loading, setLoading] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [items, setItems] = useState<IItem[]>([]);

  const options = useMemo(
    () =>
      items.filter((item) => {
        if (!searchText) {
          return true;
        }
        return item.label
          .toLocaleLowerCase()
          .includes(searchText.toLowerCase());
      }),
    [items, searchText]
  );

  const { classes } = useStyles();

  const handleDataRequest = useActualCallback(async (initial: boolean) => {
    if (typeof handler === "function") {
      const items = await handler(searchText, skip);
      setHasMore(items.length >= skipStep);
      setItems((prevItems) => {
        const prevItemMap = new Map(
          prevItems.map((item) => [item.value, item])
        );
        for (const item of items) {
          if (prevItemMap.has(item.value)) {
            prevItemMap.set(item.value, item);
          }
        }
        return [
          ...prevItemMap.values(),
          ...items.filter(({ value }) => !prevItemMap.has(value)),
        ];
      });
      setSkip(skip + skipStep);
    } else if (initial) {
      setItems(handler);
    }
  });

  const handleLoadStart = useActualCallback(() => {
    setLoading((loading) => loading + 1);
    onLoadStart && onLoadStart();
  });

  const handleLoadEnd = useActualCallback((isOk: boolean) => {
    setLoading((loading) => Math.max(loading - 1, 0));
    onLoadEnd && onLoadEnd(isOk);
  });

  useChange(
    () =>
      stateChangeSubject.once(async () => {
        let isOk = true;
        try {
          handleLoadStart();
          await handleDataRequest(true);
        } catch (e: any) {
          isOk = false;
          if (!throwError) {
            fallback && fallback(e as Error);
          } else {
            throw e;
          }
        } finally {
          handleLoadEnd(isOk);
        }
      }),
    [searchText]
  );

  const handleChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchText(e.target.value);
    },
    []
  );

  const handleKeySearch = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Escape") {
        e.stopPropagation();
      }
    },
    []
  );

  const handleChange = useCallback(
    (value: string) => {
      const item = options.find((option) => option.value === value) || null;
      setValue(item);
      onChange && onChange(item);
    },
    [onChange, options]
  );

  return (
    <FormControl
      sx={{
        minWidth: 512,
        p: 1,
        mt: 1,
        ...sx,
      }}
      {...props}
    >
      <InputLabel>Search</InputLabel>
      <Select
        open={open}
        MenuProps={{ autoFocus: false }}
        value={value?.value || "none"}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderValue={() => value?.label || "Search"}
      >
        <ListSubheader
          sx={{
            background: "transparent",
          }}
        >
          <TextField
            autoFocus
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleChangeSearch}
            onKeyDown={handleKeySearch}
            sx={{ mb: 1 }}
          />
        </ListSubheader>
        <VirtualView
          className={classes.container}
          sx={{
            height: Math.min(
              options.length * ITEM_HEIGHT,
              ITEM_HEIGHT * MAX_ITEMS_COUNT
            ),
          }}
          onDataRequest={handleDataRequest}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          fallback={fallback}
          loading={!!loading}
          throwError={throwError}
          hasMore={hasMore}
          minRowHeight={ITEM_HEIGHT}
        >
          {options.length === 0 && (
            <MenuItem
              key="not-found"
              value="not-found"
            >
              Nothing found
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              onClick={() => {
                setOpen(false);
                handleChange(option.value);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </VirtualView>
      </Select>
    </FormControl>
  );
};

export default Search;
