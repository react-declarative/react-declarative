import * as React from "react";
import { useState, useCallback, useMemo } from "react";

import { makeStyles } from "../../styles";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Box, { BoxProps } from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import VirtualView from "../VirtualView";

import useActualCallback from "../../hooks/useActualCallback";
import useReloadTrigger from "../../hooks/useReloadTrigger";

import classNames from "../../utils/classNames";
import debounce from "../../utils/hof/debounce";

const ITEM_HEIGHT = 60;
const MAX_ITEMS_COUNT = 4;
const DEFAULT_SKIP_STEP = 25;
const SEARCH_DEBOUNCE = 1_500;

interface IItem {
  value: string;
  label: string;
}

interface IState {
  searchText: string;
  skip: number;
  open: boolean;
}

interface ISearchProps extends Omit<BoxProps, keyof {
  onChange: never;
}> {
  handler: IItem[] | ((search: string, skip: number) => IItem[] | Promise<IItem[]>);
  value?: IItem | null;
  label?: React.ReactNode;
  skipStep?: number;
  onChange: (item: IItem | null) => void;
  fallback?: (e: Error) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  throwError?: boolean;
  noCleanIcon?: boolean;
}

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexDirection: 'row',
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    height: ITEM_HEIGHT * MAX_ITEMS_COUNT,
    width: "100%",
  },
  listHeader: {
    background: 'transparent',
  },
});

export const Search = ({
  className,
  handler,
  value: upperValue = null,
  label = "Search",
  onChange,
  onLoadStart,
  onLoadEnd,
  fallback,
  throwError = false,
  noCleanIcon = false,
  skipStep = DEFAULT_SKIP_STEP,
  sx,
  ...props
}: ISearchProps) => {

  const { classes } = useStyles();

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
        if (typeof handler === "function") {
          return true;
        }
        return item.label
          .toLocaleLowerCase()
          .includes(searchText.toLowerCase());
      }),
    [items, searchText, upperValue, handler]
  );

  const handleDataRequest = useActualCallback(async (initial: boolean) => {
    if (typeof handler === "function") {
      const items = await handler(searchText, initial ? 0 : skip + skipStep);
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
      setSkip(initial ? 0 : skip + skipStep);
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

  const handleChangeSearch = useMemo(
    () =>
      debounce(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setSearchText(e.target.value);
        },
        SEARCH_DEBOUNCE
      ),
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
    <Box
      className={classNames(classes.root, className)}
      sx={sx}
      {...props}
    >
      <FormControl
        sx={{
          minWidth: 512,
          pt: 1,
          pb: 1,
          mt: 1,
        }}
        fullWidth
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
          fullWidth
          renderValue={() => value?.label || "Search"}
        >
          <ListSubheader className={classes.listHeader}>
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
                        if (!loading) {
                          setSearchText("");
                          doReload();
                        }
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : <CloseIcon />}
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
              <MenuItem disabled key="none" value="none">
                {loading ? "Loading..." : "Nothing found"}
              </MenuItem>
            )}
            {upperValue && (
              <MenuItem disabled key={upperValue.value} value={upperValue.value}>
                {upperValue.label}
              </MenuItem>
            )}
            {!open && !upperValue && (
              <MenuItem key="none" value="none">
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
      {!noCleanIcon && (
        <Box
          sx={{
            mt: 2,
            mb: 1,
            ml: 1,
          }}
        >
          <Button
            disabled={!upperValue}
            variant="outlined"
            onClick={() => {
              handleChange(null);
              setOpen(false)
            }}
            sx={{
              height: '100%',
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Search;
