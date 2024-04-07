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

/**
 * Represents the state of a component.
 * @interface
 */
interface IState {
  item: ISearchItem | null;
  open: boolean;
  value: string;
}

const useStyles = makeStyles()({
  root: {
    minHeight: 425,
    minWidth: 290,
    maxHeight: '45vh',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
});

/**
 * SearchView component documentation
 *
 * @template Data - The data type of the component
 * @template Payload - The payload type of the component
 *
 * @param props - The component props
 * @param [props.className] - The class name for the component
 * @param [props.style] - The inline style for the component
 * @param [props.sx] - The sx prop for the component (sx prop is a shorthand for sx={{}} in styled components)
 * @param [props.type="text"] - The type of the input field
 * @param [props.mode="text"] - The input mode of the input field
 * @param [props.variant="standard"] - The variant of the input field
 * @param [props.pattern] - The pattern attribute of the input field
 * @param [props.value] - The value of the component
 * @param [props.label] - The label for the input field
 * @param [props.placeholder] - The placeholder for the input field
 * @param [props.searchText] - The search text for the component
 * @param [props.changeSubject] - The change subject for the component
 * @param [props.onChange=() => undefined] - The change event handler for the value
 * @param [props.onTextChange=() => undefined] - The change event handler for the search text
 * @param [props.delay=DEFAULT_DELAY] - The delay in milliseconds before executing a search
 * @param [props.limit=DEFAULT_LIMIT] - The maximum number of search results to return
 * @param [props.payload] - The payload for the search request
 * @param [props.autoComplete] - The autocomplete attribute for the input field
 * @param [props.fullWidth] - Whether the input field should take up the full width
 * @param [props.disabled] - Whether the input field should be disabled
 * @param [props.onCreate] - The callback to create a new item
 * @param [props.onLoadStart] - The callback when the search request starts
 * @param [props.onLoadEnd] - The callback when the search request ends
 * @param [props.fallback] - The fallback content to display during loading or error
 * @param props.handler - The search handler function
 * @param [props.inputRef] - The ref for the input field
 * @param [props.SearchItem=SearchItemDefault] - The component to render each search item
 * @param [props.SearchInput=SearchInputDefault] - The component to render the search input
 * @param [props.CreateButton=CreateButtonDefault] - The component to render the create button
 * @param [props.startAdornment=null] - The start adornment for the input field
 * @param [props.endAdornment=null] - The end adornment for the input field
 * @param [props.throwError] - Whether errors should be thrown or not
 * @param [props.otherProps] - Any other props that should be passed to the TextField component
 *
 * @returns The SearchView component
 */
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
  startAdornment = null,
  endAdornment = null,
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

  /**
   * Executes the given function after a certain delay.
   * @param callback - The function to be executed.
   * @param delay - The delay (in milliseconds) before executing the function.
   * @returns
   */
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
    /**
     * Handler function that processes the results based on the given parameters.
     *
     * @param limit - The number of rows to limit the results to.
     * @param offset - The number of rows to skip before returning the results.
     * @param initial - Whether to execute the initial search or not.
     * @param rows - The rows to process.
     * @returns - A promise that resolves with the processed results.
     */
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

  /**
   * Memoized function to filter out items from the rawData array based on
   * whether their value property already exists in the state.item object or not.
   * Returns a new array of filtered items.
   *
   * @function
   * @name useMemo
   * @returns - Array of filtered items
   * @param callback - Function to be memoized
   * @param deps - Dependency array determining when to recalculate the memoized value
   */
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

  /**
   * Sets the value of the 'open' property in the state.
   *
   * @param open - The new value for the 'open' property.
   */
  const setOpen = useCallback(
    (open: boolean) =>
      setState((prevState) => ({
        ...prevState,
        open,
      })),
    []
  );

  /**
   * handleChangeText is a callback function that updates the state of a component.
   *
   * @param value - The new value to be set in the state.
   *
   * @returns
   */
  const handleChangeText = useCallback(
    (value: string) =>
      setState((prevState) => ({
        ...prevState,
        value,
        item: null,
      })),
    []
  );

  /**
   * Handles the change of an item in the search.
   *
   * @param item - The selected search item.
   * @returns
   */
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

  /**
   * Handle clear function to clear the state values.
   * @function handleClear
   * @returns
   */
  const handleClear = useCallback(
    () =>
      setState(() => ({
        open: false,
        value: "",
        item: null,
      })),
    []
  );

  /**
   * Returns the value from the underlying callback function,
   * or an empty string if the value is falsy.
   *
   * @returns The value obtained from the callback function,
   *                   or an empty string if the value is falsy.
   */
  const getValue = useActualCallback(
    () => state.item?.label || state.value || ""
  );

  /**
   * Retrieves the value of text from an external source.
   *
   * @returns The value of the text.
   */
  const textValue = getValue();

  return (
    <Box
      ref={anchorElRef}
      onContextMenu={() => setOpen(false)}
      className={className}
      style={style}
      sx={sx}
    >
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
          startAdornment: startAdornment ? (
            <InputAdornment position="start">
              {startAdornment}
            </InputAdornment>
          ) : undefined,
          endAdornment: (
            <InputAdornment
              sx={{
                display: (state.item || endAdornment) ? undefined : "none",
              }}
              position="end"
            >
              {state.item ? (
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
              ): endAdornment}
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
