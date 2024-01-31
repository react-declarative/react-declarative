import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import SearchView from "../../../../SearchView";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ListSubheader from "@mui/material/ListSubheader";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";

import ISearchInputProps from "../../../../SearchView/model/ISearchInputProps";

import useChangeSubject from "../../../../../hooks/useChangeSubject";
import useActualValue from "../../../../../hooks/useActualValue";

import deepClone from "../../../../../utils/deepClone";
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
  outlined = true,
  title = "",
  placeholder = "",
  dirty,
  loading,
  inputRef,
  onChange,
  name,
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
}: IDictSlot) => {
  const payload = useOnePayload();
  const { object, setObject } = useOneState<object>();

  const changeSubject = useChangeSubject(value);

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

        const emitChangeSearch = useMemo(
          () =>
            debounce((value: string) => {
              onTextChange(value);
            }, SEARCH_DEBOUNCE),
          []
        );

        useEffect(() => () => {
          emitChangeSearch.flush();
        }, []);

        useEffect(() => waitForMove(emitChangeSearch.flush), []);

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
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
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

  const handleChange = useCallback(
    (object: object) =>
      setObject(
        deepClone({
          ...object$.current,
          ...object,
        }),
        {}
      ),
    []
  );

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
        dictOnItem(item?.value || null, object$.current, payload, onChange, handleChange);
        onChange(item?.value || null);
      }}
      onTextChange={(search) =>
        dictOnText(search, object$.current, payload, onChange, handleChange)
      }
      onCreate={
        dictOnAppend
          ? (search) =>
              dictOnAppend(search, object$.current, payload, onChange, handleChange)
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
