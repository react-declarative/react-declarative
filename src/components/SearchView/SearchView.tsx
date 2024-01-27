import * as React from "react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

import { makeStyles } from "../../styles";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";

import SearchItemDefault from "./components/SearchItem";
import CreateButtonDefault from "./components/CreateButton";
import SearchInputDefault from "./components/SearchInput";
import SearchList from "./components/SearchList";

import useActualCallback from "../../hooks/useActualCallback";
import useQueuedAction from "../../hooks/useQueuedAction";
import useActualValue from "../../hooks/useActualValue";
import useActualState from "../../hooks/useActualState";
import useSingleton from "../../hooks/useSingleton";
import useSubject from "../../hooks/useSubject";
import useChange from "../../hooks/useChange";

import { useOffsetPaginator } from "../Grid";

import ISearchItem from "./model/ISearchItem";
import IAnything from "../../model/IAnything";
import ISearchViewProps from "./model/ISearchViewProps";

import CloseIcon from "@mui/icons-material/Close";

import { SEARCH_VIEW_ROOT } from "./config";

const DEFAULT_DELAY = 500;
const DEFAULT_LIMIT = 25;

interface IState {
  item: ISearchItem | null;
  open: boolean;
  value: string;
}

const useStyles = makeStyles()({
  root: {
    minHeight: 425,
    minWidth: 290,
  },
});

export const SearchView = <
  Data extends IAnything = IAnything,
  Payload = IAnything
>({
  className,
  style,
  sx,
  type = "text",
  mode = "text",
  variant = "standard",
  pattern,
  value,
  label,
  placeholder,
  searchText,
  changeSubject: upperChangeSubject,
  onChange = () => undefined,
  onTextChange = () => undefined,
  delay = DEFAULT_DELAY,
  limit = DEFAULT_LIMIT,
  payload: upperPayload = {} as Payload,
  autoComplete,
  fullWidth,
  disabled,
  onCreate,
  onLoadStart,
  onLoadEnd,
  fallback,
  handler,
  inputRef,
  SearchItem = SearchItemDefault,
  SearchInput = SearchInputDefault,
  CreateButton = CreateButtonDefault,
  throwError,
  ...otherProps
}: ISearchViewProps<Data, Payload>) => {
  const { classes } = useStyles();

  const reloadSubject = useSubject<void>();

  const anchorElRef = useRef<HTMLDivElement>(null);

  const payload = useSingleton(upperPayload);

  const [initComplete$, setInitComplete] = useActualState(false);

  const [state, setState] = useState<IState>(() => ({
    item: null,
    open: false,
    value: "",
  }));

  const changeSubject = useSubject(upperChangeSubject);

  const search$ = useActualValue(state.value);

  const onChange$ = useActualCallback(onChange);
  const onTextChange$ = useActualCallback(onTextChange);

  const { execute } = useQueuedAction(
    async () => {
      const state: IState = {
        value: "",
        item: null,
        open: false,
      };
      if (value) {
        if (typeof value === "function") {
          const item = await value();
          Object.assign(state, { item });
        } else if (value) {
          Object.assign(state, { item: value });
        }
      }
      if (searchText) {
        if (typeof searchText === "function") {
          const value = await searchText();
          Object.assign(state, { value });
        } else if (searchText) {
          Object.assign(state, { value: searchText });
        }
      }
      setState(state);
      setInitComplete(true);
    },
    {
      onLoadStart,
      onLoadEnd,
      fallback,
      throwError,
    }
  );

  useEffect(() => {
    execute();
  }, []);

  useEffect(
    () =>
      changeSubject.subscribe(() => {
        if (initComplete$.current) {
          setInitComplete(false);
          execute();
        }
      }),
    []
  );

  const {
    data: rawData,
    hasMore,
    loading,
    onSkip,
    clear,
  } = useOffsetPaginator<ISearchItem>({
    reloadSubject,
    handler: async (limit, offset, initial, rows) => {
      return await handler(search$.current, limit, offset, initial, rows);
    },
    onLoadStart,
    onLoadEnd,
    fallback,
    throwError,
    delay,
    limit,
  });

  const data = useMemo(() => {
    const valueSet = new Set<string>([state.item?.value || ""]);
    return rawData.filter((item) => {
      const result = !valueSet.has(item.value);
      valueSet.add(item.value);
      return result;
    });
  }, [rawData, state.item]);

  useChange(() => {
    if (initComplete$.current) {
      reloadSubject.next();
      onTextChange$(state.value);
    }
  }, [state.value]);

  useChange(() => {
    if (initComplete$.current) {
      reloadSubject.next();
      onChange$(state.item);
      onTextChange$(state.item?.label || "");
    }
  }, [state.item]);

  const setOpen = useCallback(
    (open: boolean) =>
      setState((prevState) => ({
        ...prevState,
        open,
      })),
    []
  );

  const handleChangeText = useCallback(
    (value: string) =>
      setState((prevState) => ({
        ...prevState,
        value,
        item: null,
      })),
    []
  );

  const handleChangeItem = useCallback(
    (item: ISearchItem) =>
      setState((prevState) => ({
        ...prevState,
        value: item.label,
        open: false,
        item,
      })),
    []
  );

  const handleClear = useCallback(
    () =>
      setState(() => ({
        open: false,
        value: "",
        item: null,
      })),
    []
  );

  const getValue = useActualCallback(
    () => state.item?.label || state.value || ""
  );

  const textValue = getValue();

  return (
    <Box ref={anchorElRef} className={className} style={style} sx={sx}>
      <TextField
        {...otherProps}
        fullWidth
        key={textValue}
        focused={false}
        autoComplete={autoComplete}
        type={type}
        label={label}
        placeholder={placeholder}
        ref={inputRef}
        onClick={() => setOpen(true)}
        value={textValue}
        disabled={disabled || !initComplete$.current}
        inputProps={{
          pattern,
        }}
        InputProps={{
          inputMode: mode,
          readOnly: true,
          endAdornment: (
            <InputAdornment
              sx={{
                display: state.item ? undefined : "none",
              }}
              position="end"
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                edge="end"
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Popover
        className={SEARCH_VIEW_ROOT}
        anchorEl={anchorElRef.current}
        open={state.open}
        onClose={() => {
          clear();
          setOpen(false);
        }}
      >
        <div className={classes.root}>
          {state.open && (
            <SearchInput
              type={type}
              mode={mode}
              pattern={pattern}
              placeholder={label || placeholder}
              autoComplete={autoComplete}
              reloadSubject={reloadSubject}
              loading={loading}
              getValue={getValue}
              onTextChange={handleChangeText}
            />
          )}
          {state.open && (
            <SearchList
              items={data}
              value={state.value}
              payload={payload}
              item={state.item}
              hasMore={hasMore}
              loading={loading}
              onDataRequest={onSkip}
              onLoadStart={onLoadStart}
              onLoadEnd={onLoadEnd}
              fallback={fallback}
              throwError={throwError}
              SearchItem={SearchItem}
              CreateButton={CreateButton}
              onItemChange={handleChangeItem}
              onCreate={
                onCreate
                  ? (value: string) => {
                      onCreate(value);
                      setOpen(false);
                    }
                  : undefined
              }
            />
          )}
        </div>
      </Popover>
    </Box>
  );
};

export default SearchView;
