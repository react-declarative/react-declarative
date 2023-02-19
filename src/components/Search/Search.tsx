import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import { SxProps } from "@mui/system";

import { makeStyles } from "../../styles";

import InputLabel from "@mui/material/InputLabel";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import VirtualView from "../VirtualView";

import useActualCallback from "../../hooks/useActualCallback";
import debounce from '../../utils/hof/debounce';
import useReloadTrigger from "../../hooks/useReloadTrigger";

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
  open: boolean;
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
  value?: IItem | null;
  label?: React.ReactNode;
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
    height: ITEM_HEIGHT * MAX_ITEMS_COUNT,
    width: "100%",
  },
});

export const Search = ({
  handler,
  value: upperValue = null,
  label = "Search",
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

  const { reloadTrigger, doReload } = useReloadTrigger();

  const [state, setState] = useState<IState>({
    searchText: "",
    open: false,
    skip: 0,
  });

  const { searchText, skip, open } = state;

  const setSkip = (skip: number) =>
    setState((prevState) => ({
      ...prevState,
      skip,
    }));

  const setOpen = (open: boolean) =>
    setState((prevState) => ({
      ...prevState,
      open,
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
        if (item.value === upperValue?.value) {
          return false;
        }
        if (!searchText) {
          return true;
        }
        if (typeof handler === 'function') {
          return true;
        }
        return item.label
          .toLocaleLowerCase()
          .includes(searchText.toLowerCase());
      }),
    [items, searchText, upperValue, handler]
  );

  const { classes } = useStyles();

  const handleDataRequest = useActualCallback(async (initial: boolean) => {
    if (typeof handler === "function") {
      const items = await handler(searchText, initial ? 0 : (skip + skipStep));
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
      setSkip(initial ? 0 : (skip + skipStep));
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

  const handleChangeSearch = useMemo(() =>
    debounce((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchText(e.target.value);
    }, 500),
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
    (value: string | null) => {
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
      <InputLabel>{label}</InputLabel>
      <Select
        open={open}
        MenuProps={{ autoFocus: false }}
        value={value?.value || "none"}
        onOpen={() => setOpen(true)}
        onClose={() => {
          setSearchText("");
          setOpen(false);
        }}
        renderValue={() => value?.label || "Search"}
      >
        <ListSubheader
          sx={{
            background: "transparent",
          }}
        >
          <TextField
            key={reloadTrigger}
            autoFocus
            fullWidth
            disabled={!!loading}
            defaultValue={searchText}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disabled={!!loading}
                    onClick={() => {
                      setSearchText("");
                      doReload();
                    }}>
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={handleChangeSearch}
            onKeyDown={handleKeySearch}
            sx={{ mb: 1 }}
          />
        </ListSubheader>
        <VirtualView
          key={searchText}
          className={classes.container}
          onDataRequest={handleDataRequest}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          fallback={fallback}
          loading={!!loading}
          throwError={throwError}
          hasMore={hasMore}
          minRowHeight={ITEM_HEIGHT}
        >
          {open && options.length === 0 && !upperValue && (
            <MenuItem
              key="none"
              value="none"
            >
              {loading ? "Loading..." : "Nothing found"}
            </MenuItem>
          )}
          {upperValue && (
            <MenuItem
              key={upperValue.value}
              value={upperValue.value}
            >
              {upperValue.label}
            </MenuItem>
          )}
          {!open && !upperValue && (
            <MenuItem
              key="none"
              value="none"
            >
              Search
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
