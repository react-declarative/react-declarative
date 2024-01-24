import * as React from "react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Popover from "@mui/material/Popover";

import SearchInput from "./components/SearchInput";
import SearchList from "./components/SearchList";

import useActualCallback from "../../hooks/useActualCallback";
import useActualValue from "../../hooks/useActualValue";
import useActualState from "../../hooks/useActualState";
import useAsyncAction from "../../hooks/useAsyncAction";
import useSubject from "../../hooks/useSubject";
import useChange from "../../hooks/useChange";

import { useOffsetPaginator } from "../Grid";

import ISearchItem from "./model/ISearchItem";
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

export const SearchView = ({
  className,
  style,
  sx,
  type = "text",
  variant = "standard",
  value,
  onChange = () => undefined,
  onTextChange = () => undefined,
  delay = DEFAULT_DELAY,
  limit = DEFAULT_LIMIT,
  fullWidth,
  disabled,
  onCreate,
  onLoadStart,
  onLoadEnd,
  fallback,
  handler,
  throwError,
  ...otherProps
}: ISearchViewProps) => {
  const reloadSubject = useSubject<void>();

  const inputRef = useRef<HTMLInputElement>(null);

  const [initComplete$, setInitComplete] = useActualState(false);

  const [state, setState] = useState<IState>(() => ({
    item: null,
    open: false,
    value: "",
  }));

  const search$ = useActualValue(state.value);

  const onChange$ = useActualCallback(onChange);
  const onTextChange$ = useActualCallback(onTextChange);

  const setItem = useCallback(
    (item: ISearchItem) =>
      setState((prevState) => ({
        ...prevState,
        item,
      })),
    []
  );

  const { execute } = useAsyncAction(
    async () => {
      if (typeof value === "function") {
        const item = await value();
        setItem(item);
      } else if (value) {
        setItem(value);
      }
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

  const getValue = useActualCallback(() => state.item?.label || state.value);

  return (
    <>
      <TextField
        {...otherProps}
        className={className}
        style={style}
        sx={sx}
        ref={inputRef}
        onClick={() => setOpen(true)}
        value={state.item?.label || state.value}
        disabled={disabled || !initComplete$.current}
        InputProps={{
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
        anchorEl={inputRef.current}
        open={state.open}
        onClose={() => {
          clear();
          setOpen(false);
        }}
      >
        <SearchInput
          type={type}
          reloadSubject={reloadSubject}
          loading={loading}
          getValue={getValue}
          onTextChange={handleChangeText}
        />
        {state.open && (
          <SearchList
            items={data}
            value={state.value}
            item={state.item}
            hasMore={hasMore}
            loading={loading}
            onDataRequest={onSkip}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            fallback={fallback}
            throwError={throwError}
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
      </Popover>
    </>
  );
};

export default SearchView;
