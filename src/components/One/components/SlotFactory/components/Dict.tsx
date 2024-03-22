import * as React from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import SearchView from "../../../../SearchView";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ListSubheader from "@mui/material/ListSubheader";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import ISearchInputProps from "../../../../SearchView/model/ISearchInputProps";

import IManaged, { PickProp } from "../../../../../model/IManaged";
import IAnything from "../../../../../model/IAnything";

import useChangeSubject from "../../../../../hooks/useChangeSubject";
import useActualValue from "../../../../../hooks/useActualValue";

import debounce from "../../../../../utils/hof/debounce";
import formatText from "../../../../../utils/formatText";
import waitForMove from "../../../../../utils/waitForMove";

import { IDictSlot } from "../../../slots/DictSlot";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const SEARCH_DEBOUNCE = 1_500;

const DEFAULT_LIMIT = 25;
const DEFAULT_DELAY = 500;
const DEFAULT_ONTEXT = () => null;
const DEFAULT_ONITEM = () => null;
const DEFAULT_VALUE = () => {
  throw new Error(
    "react-declarative DictField dictValue callback is not provided"
  );
};
const DEFAULT_SEARCH = () => {
  throw new Error(
    "react-declarative DictField dictSearch callback is not provided"
  );
};
const DEFAULT_SEARCHTEXT = () => "";

const NEVER_POS = Symbol("never-pos");

const getCaretPos = (element: HTMLInputElement | HTMLTextAreaElement) => {
  return element.selectionStart || element.value.length;
};

const createIcon = (
  icon: React.ComponentType<any>,
  data: IAnything,
  payload: IAnything,
  disabled: boolean,
  readonly: boolean,
  value: IAnything,
  onChange: (data: IAnything) => void,
  onValueChange: PickProp<IManaged, "onChange">,
  click: PickProp<IManaged, "leadingIconClick">,
  edge: "start" | "end",
  ripple: boolean
) => (
  <IconButton
    disableRipple={!ripple}
    onClick={() => {
      if (click) {
        click(
          value,
          data,
          payload,
          (v) =>
            onValueChange(v, {
              skipReadonly: true,
            }),
          onChange
        );
      }
    }}
    edge={edge}
  >
    {React.createElement(icon, { data, payload, disabled, readonly })}
  </IconButton>
);

/**
 * @typedef  Dict - A variable with several properties related to a dictionary.
 * @property invalid - Represents the invalid state of the dictionary.
 * @property incorrect - Represents the incorrect state of the dictionary.
 * @property value - Represents the value of the dictionary.
 * @property disabled - Indicates whether the dictionary is disabled or not.
 * @property readonly - Indicates whether the dictionary is readonly or not.
 * @property inputType - Represents the type of the input for the dictionary (default is "text").
 * @property inputMode - Represents the mode of the input for the dictionary (default is "text").
 * @property inputPattern - Represents the pattern of the input for the dictionary (default is undefined).
 * @property inputAutocomplete - Represents the autocomplete attribute of the input for the dictionary.
 * @property description - Represents the description of the dictionary (default is an empty string).
 * @property outlined - Indicates whether the dictionary is outlined or not (default is false).
 * @property title - Represents the title of the dictionary.
 * @property placeholder - Represents the placeholder of the dictionary.
 * @property dirty - Represents the dirty state of the dictionary.
 * @property loading - Indicates whether the dictionary is loading or not.
 * @property inputRef - Represents the reference of the input for the dictionary.
 * @property onChange - Represents the change event handler for the dictionary.
 * @property dictLimit - Represents the limit for the dictionary (default is DEFAULT_LIMIT).
 * @property dictDelay - Represents the delay for the dictionary (default is DEFAULT_DELAY).
 * @property dictOnText - Represents the onText event handler for the dictionary (default is DEFAULT_ONTEXT).
 * @property dictOnItem - Represents the onItem event handler for the dictionary (default is DEFAULT_ONITEM).
 * @property dictSearch - Represents the search function for the dictionary (default is DEFAULT_SEARCH).
 * @property dictValue - Represents the value function for the dictionary (default is DEFAULT_VALUE).
 * @property dictSearchText - Represents the searchText function for the dictionary (default is DEFAULT_SEARCHTEXT).
 * @property dictOnAppend - Represents the onAppend function for the dictionary.
 * @property dictSearchItem - Represents the search item for the dictionary.
 * @property dictCreateButton - Represents the create button for the dictionary.
 * @property inputFormatterSymbol - Represents the symbol used in the input formatter for the dictionary (default is "0").
 * @property inputFormatterAllowed - Represents the allowed characters in the input formatter for the dictionary.
 * @property inputFormatterReplace - Represents the characters to be replaced in the input formatter for the dictionary.
 * @property inputFormatterTemplate - Represents the template for the input formatter for the dictionary (default is an empty string).
 * @property inputFormatter - Represents the formatter function for the dictionary.
 * @property leadingIcon - Represents the leading icon for the dictionary.
 * @property trailingIcon - Represents the trailing icon for the dictionary.
 * @property leadingIconClick - Represents the click event handler for the leading icon of the dictionary.
 * @property trailingIconClick - Represents the click event handler for the trailing icon of the dictionary.
 * @property leadingIconRipple - Indicates whether the leading icon of the dictionary has ripple effect or not (default is true).
 * @property trailingIconRipple - Indicates whether the trailing icon of the dictionary has ripple effect or not (default is true).
 */
export const Dict = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  inputMode = "text",
  inputPattern = undefined,
  inputAutocomplete,
  description = "",
  outlined = false,
  title = "",
  placeholder = "",
  dirty,
  loading,
  inputRef,
  onChange,
  dictLimit = DEFAULT_LIMIT,
  dictDelay = DEFAULT_DELAY,
  dictOnText = DEFAULT_ONTEXT,
  dictOnItem = DEFAULT_ONITEM,
  dictSearch = DEFAULT_SEARCH,
  dictValue = DEFAULT_VALUE,
  dictSearchText = DEFAULT_SEARCHTEXT,
  dictOnAppend,
  dictSearchItem,
  dictCreateButton,
  inputFormatterSymbol: symbol = "0",
  inputFormatterAllowed: allowed,
  inputFormatterReplace: replace,
  inputFormatterTemplate: template = "",
  inputFormatter = (raw) =>
    formatText(raw, template, {
      symbol,
      allowed,
      replace,
    }),
  leadingIcon: li,
  trailingIcon: ti,
  leadingIconClick: lic,
  trailingIconClick: tic,
  leadingIconRipple: lir = true,
  trailingIconRipple: tir = true,
}: IDictSlot) => {
  const payload = useOnePayload();
  const { object, changeObject: handleChange } = useOneState<object>();

  const changeSubject = useChangeSubject(value);

  /**
   * @typedef {Object} CaretManager
   * @property {() => void} render - Renders the caret position on the input element.
   * @property {() => number | symbol} pos - Returns the current caret position or a symbol to indicate position is unavailable.
   */
  const SearchInput = useMemo(
    (): React.FC<ISearchInputProps> =>
      ({
        type,
        mode,
        pattern,
        getValue,
        loading,
        autoComplete,
        onTextChange,
        reloadSubject,
      }) => {
        const [value, setValue] = useState(getValue);

        const inputElementRef = useRef<HTMLInputElement>(null);

        /**
         * Manages the caret position for an input element.
         * @typedef {Object} CaretManager
         * @property {() => void} render - Renders the caret position on the input element.
         * @property {() => number | symbol} pos - Returns the current caret position or a symbol to indicate position is unavailable.
         */
        const caretManager = useMemo(() => {
          let lastPos: symbol | number = NEVER_POS;

          const getAdjust = (pos: number) => {
            let adjust = 0;
            for (let i = Math.max(pos - 1, 0); i < template.length; i++) {
              const char = template[i];
              if (char === symbol) {
                break;
              }
              adjust += 1;
            }
            return adjust;
          };

          return {
            render: () => {
              if (inputType !== "text") {
                return;
              }
              const { current: input } = inputElementRef;
              if (typeof lastPos === "number") {
                input?.setSelectionRange(lastPos, lastPos);
                lastPos = NEVER_POS;
              }
            },
            pos: () => {
              const { current: input } = inputElementRef;
              if (input) {
                lastPos = getCaretPos(input);
                lastPos += getAdjust(lastPos);
              }
              return lastPos;
            },
          };
        }, []);

        useLayoutEffect(() => {
          if (!template) {
            return;
          }
          const { current: input } = inputElementRef;
          const handler = () => caretManager.pos();
          input && input.addEventListener("keyup", handler);
          input && input.addEventListener("click", handler);
          return () => {
            input && input.removeEventListener("keyup", handler);
            input && input.removeEventListener("click", handler);
          };
        }, [inputElementRef.current]);

        useLayoutEffect(() => {
          if (template) {
            caretManager.render();
          }
        }, [value]);

        useEffect(
          () =>
            reloadSubject.subscribe(() => {
              inputElementRef.current?.focus();
              setValue(getValue);
            }),
          []
        );

        useEffect(() => {
          if (!loading) {
            inputElementRef.current?.focus();
            setValue(getValue);
          }
        }, [loading]);

        /**
         * Returns a memoized version of a debounced function that emits change search event.
         *
         * @param {Function} onTextChange - The function to execute when the debounced function emits a change search event.
         * @param {number} SEARCH_DEBOUNCE - The delay, in milliseconds, for debouncing the change search event.
         * @returns {Function} The memoized debounced function that emits change search event.
         */
        const emitChangeSearch = useMemo(
          () =>
            debounce((value: string) => {
              onTextChange(value);
            }, SEARCH_DEBOUNCE),
          []
        );

        useEffect(
          () => () => {
            emitChangeSearch.flush();
          },
          []
        );

        useEffect(() => waitForMove(emitChangeSearch.flush), []);

        /**
         * Callback function to handle keydown search.
         *
         * @param {React.KeyboardEvent<HTMLDivElement>} e - The keyboard event object.
         *
         * @return {void}
         */
        const handleKeySearch = useCallback(
          (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key !== "Escape") {
              e.stopPropagation();
            }
          },
          []
        );

        return (
          <ListSubheader sx={{ background: "transparent", pt: 1.5 }}>
            <TextField
              inputRef={inputElementRef}
              type={type}
              variant="standard"
              autoFocus
              fullWidth
              disabled={loading}
              value={value}
              autoComplete={autoComplete}
              placeholder={title || placeholder}
              inputProps={{
                pattern,
              }}
              InputProps={{
                inputMode: mode,
                startAdornment: (
                  <InputAdornment
                    sx={{ position: "relative" }}
                    position="start"
                  >
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment sx={{ position: "relative" }} position="end">
                    <IconButton
                      disabled={loading}
                      onClick={() => {
                        onTextChange("");
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : <CloseIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={({ target }) => {
                let result = target.value;
                if (template) {
                  result = "";
                  for (let i = 0; i < target.value.length; i++) {
                    result += target.value[i];
                    result = inputFormatter(result);
                  }
                  caretManager.pos();
                }
                setValue(result);
                emitChangeSearch(result);
              }}
              onKeyDown={handleKeySearch}
              sx={{ mb: 1 }}
            />
          </ListSubheader>
        );
      },
    []
  );

  const object$ = useActualValue(object);

  return (
    <SearchView
      sx={{
        ...(!outlined && {
          position: "relative",
          mt: 1,
          "& .MuiFormHelperDict-root": {
            position: "absolute",
            top: "100%",
          },
        }),
      }}
      startAdornment={
        li &&
        createIcon(
          li,
          object,
          payload,
          !!disabled,
          !!readonly,
          value as IAnything,
          handleChange,
          onChange,
          lic,
          "start",
          lir
        )
      }
      endAdornment={
        ti &&
        createIcon(
          ti,
          object,
          payload,
          !!disabled,
          !!readonly,
          value as IAnything,
          handleChange,
          onChange,
          tic,
          "end",
          tir
        )
      }
      handler={async (search, limit, offset, initial, rows) => {
        return await dictSearch({
          search,
          limit,
          offset,
          initial,
          data: object$.current,
          payload,
          rows,
        });
      }}
      changeSubject={changeSubject}
      mode={inputMode}
      pattern={inputPattern}
      autoComplete={inputAutocomplete}
      limit={dictLimit}
      delay={dictDelay}
      inputRef={inputRef}
      variant={outlined ? "outlined" : "standard"}
      helperText={(dirty && (invalid || incorrect)) || description}
      error={dirty && (invalid !== null || incorrect !== null)}
      type={inputType as any}
      value={async () => {
        if (value) {
          const result = await dictValue(value, object$.current, payload);
          return result || null;
        }
        return null;
      }}
      searchText={async () => {
        const result = await dictSearchText(object$.current, payload);
        return result || "";
      }}
      placeholder={placeholder}
      onChange={(item) => {
        dictOnItem(
          item?.value || null,
          object$.current,
          payload,
          onChange,
          handleChange
        );
        onChange(item?.value || null);
      }}
      onTextChange={(search) =>
        dictOnText(search, object$.current, payload, onChange, handleChange)
      }
      onCreate={
        dictOnAppend
          ? (search) =>
              dictOnAppend(
                search,
                object$.current,
                payload,
                onChange,
                handleChange
              )
          : undefined
      }
      label={title}
      payload={payload}
      disabled={disabled || loading || readonly}
      SearchItem={dictSearchItem}
      CreateButton={dictCreateButton}
      SearchInput={SearchInput}
    />
  );
};

export default Dict;
