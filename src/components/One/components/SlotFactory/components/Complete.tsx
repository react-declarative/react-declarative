import * as React from "react";
import { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";

import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import MatTextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import ClearIcon from "@mui/icons-material/Clear";

import VirtualView from "../../../../VirtualView";

import { useOnePayload } from "../../../context/PayloadProvider";
import { useOneState } from "../../../context/StateProvider";
import { useOneProps } from "../../../context/PropsProvider";
import { useOneMenu } from "../../../context/MenuProvider";

import useActualCallback from "../../../../../hooks/useActualCallback";
import useElementSize from "../../../../../hooks/useElementSize";
import useActualValue from "../../../../../hooks/useActualValue";
import useDebounce from "../../../hooks/useDebounce";

import { ICompleteSlot } from "../../../slots/CompleteSlot";

import queued from "../../../../../utils/hof/queued";
import formatText from "../../../../../utils/formatText";

const FETCH_DEBOUNCE = 500;
const ITEMS_LIMIT = 100;
const ITEM_HEIGHT = 36;

const NEVER_POS = Symbol("never-pos");

const getCaretPos = (element: HTMLInputElement | HTMLTextAreaElement) => {
  return element.selectionStart || element.value.length;
};

export const Complete = ({
  invalid,
  incorrect,
  value,
  disabled,
  readonly,
  inputType = "text",
  inputMode = "text",
  inputPattern = undefined,
  labelShrink,
  description = "",
  outlined = true,
  keepRaw = false,
  title = "",
  placeholder = "",
  inputAutocomplete: autoComplete = "off",
  dirty,
  loading: upperLoading,
  tip = () => ["unset"],
  tipSelect,
  autoFocus,
  onChange,
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
  withContextMenu,
}: ICompleteSlot) => {
  const payload = useOnePayload();
  const { object, changeObject: handleChangeObj } = useOneState<object>();
  const { requestSubject } = useOneMenu();

  const {
    fallback = (e: Error) => {
      throw e;
    },
  } = useOneProps();

  const { elementRef: anchorElRef, size } = useElementSize<HTMLDivElement>();
  const inputElementRef = useRef<HTMLInputElement>(null);

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = ({ clientX, clientY, target }: React.MouseEvent<HTMLDivElement>) => {
    const pointTarget = document.elementFromPoint(clientX, clientY);
    if (pointTarget) {
      setAnchorEl(pointTarget as HTMLDivElement);
      return;
    }
    setAnchorEl(target as unknown as HTMLDivElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedIdx, setSelectedIdx] = useState(-1);

  const [currentLoading, setCurrentLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);

  const loading = upperLoading || currentLoading;
  const value$ = useActualValue(value);

  const [valueD] = useDebounce(value, FETCH_DEBOUNCE);

  const tip$ = useActualValue(tip);
  const object$ = useActualValue(object);

  const onChange$ = useActualCallback(onChange);

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

  const handleChange = useMemo(
    () =>
      queued(async (text: string) => {
        setSelectedIdx(-1);
        await onChange$(text);
      }),
    []
  );

  const handleRequest = useMemo(
    () =>
      queued(async () => {
        setCurrentLoading(true);
        try {
          let items =
            typeof tip$.current === "function"
              ? await tip$.current(
                  value$.current || "",
                  object$.current,
                  payload
                )
              : tip$.current;
          if (Array.isArray(items)) {
            if (!keepRaw && value$.current) {
              const search = String(value$.current || "").toLowerCase();
              const searchQuery = search.split(" ");
              items = items.filter((item) => {
                const itemValue = String(item).toLowerCase().split(" ");
                let isOk = true;
                searchQuery.forEach((search) => {
                  isOk =
                    isOk &&
                    itemValue.some((item: string) => {
                      return item.includes(search);
                    });
                });
                return isOk;
              });
            }
            items = items.slice(0, ITEMS_LIMIT);
            setSelectedIdx(-1);
            setItems([...new Set(items)]);
          } else {
            throw new Error("CompleteField itemList invalid result");
          }
        } catch (error: any) {
          fallback(error);
        } finally {
          setCurrentLoading(false);
        }
      }),
    []
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    handleRequest();
  }, [valueD, open]);

  const handleBlur = () => {
    handleClose();
    setSelectedIdx(-1);
    inputElementRef.current?.setSelectionRange(null, null);
  };

  const handleKeyDown = (key: string, blur: () => void) => {
    if (key === "Escape") {
      handleClose();
      setSelectedIdx(-1);
      blur();
      return true;
    }
    if (key === "ArrowDown") {
      setSelectedIdx((idx) => Math.min(Math.max(idx + 1, 0), items.length - 1));
      return true;
    }
    if (key === "ArrowUp") {
      setSelectedIdx((idx) => Math.min(Math.max(idx - 1, 0), items.length - 1));
      return true;
    }
    if (key === "Enter") {
      const item = items.find((_, idx) => idx === selectedIdx);
      if (item) {
        handleChange(item);
        inputElementRef.current?.setSelectionRange(item.length, item.length);
        handleClose();
        setSelectedIdx(-1);
        return true;
      }
    }
    return false;
  };

  useEffect(() => withContextMenu && requestSubject.subscribe(() => {
    handleBlur();
  }), []);

  return (
    <>
      <div ref={anchorElRef}>
        <MatTextField
          sx={{
          ...(!outlined && {
              position: 'relative',
              mt: 1,
              '& .MuiFormHelperText-root': {
                  position: 'absolute',
                  top: '100%',
              },
            })
          }}
          fullWidth
          inputRef={inputElementRef}
          variant={outlined ? "outlined" : "standard"}
          value={String(value || "")}
          helperText={(dirty && (invalid || incorrect)) || description}
          error={dirty && (invalid !== null || incorrect !== null)}
          InputProps={{
            onKeyDown: (e) => {
              if (handleKeyDown(e.key, () => e.currentTarget.blur())) {
                e.preventDefault();
              }
            },
            autoComplete,
            readOnly: readonly,
            inputMode,
            autoFocus,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!loading && !open && !!value) {
                      handleChange("");
                      inputElementRef.current?.setSelectionRange(null, null);
                    }
                  }}
                  disabled={disabled}
                  edge="end"
                >
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {!loading && !open && !!value && (
                    <ClearIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            pattern: inputPattern,
          }}
          InputLabelProps={labelShrink ? {
            shrink: labelShrink,
          } : undefined}
          type={inputType}
          focused={autoFocus}
          autoComplete={autoComplete}
          placeholder={placeholder}
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
            onChange(result);
          }}
          onClick={handleClick}
          label={title}
          disabled={disabled}
        />
      </div>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorElRef.current}
        onClose={handleBlur}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        {!!anchorEl && (
          <VirtualView
            component={List}
            sx={{
              width: size.width,
              height: items.length
                ? Math.min(items.length * ITEM_HEIGHT, 250)
                : ITEM_HEIGHT,
              mb: 1,
            }}
            minRowHeight={ITEM_HEIGHT}
          >
            {!items.length && (
              <ListItem disableGutters dense>
                <ListItemButton disableRipple disableTouchRipple>
                  <ListItemText primary={loading ? "Loading" : "No tips"} />
                </ListItemButton>
              </ListItem>
            )}
            {items.map((value, idx) => (
              <ListItem disableGutters dense key={`${value}-${idx}`}>
                <ListItemButton
                  selected={idx === selectedIdx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleChange(value);
                    tipSelect && tipSelect(value, object$.current, payload, handleChangeObj);
                    handleClose();
                  }}
                >
                  <ListItemText primary={value} />
                </ListItemButton>
              </ListItem>
            ))}
          </VirtualView>
        )}
      </Popover>
    </>
  );
};

export default Complete;
