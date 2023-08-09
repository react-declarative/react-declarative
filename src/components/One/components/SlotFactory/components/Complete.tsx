import * as React from "react";
import { useState, useEffect, useMemo, useRef } from "react";

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

import useActualCallback from "../../../../../hooks/useActualCallback";
import useActualValue from "../../../../../hooks/useActualValue";
import useDebounce from "../../../hooks/useDebounce";

import { ICompleteSlot } from "../../../slots/CompleteSlot";

import queued from "../../../../../utils/hof/queued";

const FETCH_DEBOUNCE = 500;
const ITEMS_LIMIT = 100;
const ITEM_HEIGHT = 36;

export const Complete = ({
  invalid,
  value,
  disabled,
  readonly,
  inputType = "text",
  inputMode = "text",
  inputPattern = undefined,
  description = "",
  outlined = true,
  title = "",
  placeholder = "",
  inputAutocomplete: autoComplete = "off",
  dirty,
  loading: upperLoading,
  tip = () => ["unset"],
  autoFocus,
  inputRef,
  onChange,
  name,
}: ICompleteSlot) => {
  const payload = useOnePayload();
  const { object } = useOneState();

  const {
    fallback = (e: Error) => {
      throw e;
    },
  } = useOneProps();

  const anchorElRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const [selectedIdx, setSelectedIdx] = useState(-1);

  const [currentLoading, setCurrentLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);

  const loading = upperLoading || currentLoading;
  const value$ = useActualValue(value);

  const [valueD, { pending }] = useDebounce(value, FETCH_DEBOUNCE);

  const tip$ = useActualValue(tip);
  const object$ = useActualValue(object);

  const onChange$ = useActualCallback(onChange);

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
            if (value$.current) {
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
            setItems(items);
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
    if (open) {
      let isOk = true;
      isOk = isOk && value;
      isOk = isOk && !pending();
      isOk = isOk && items.length === 1;
      if (isOk) {
        handleChange(items[0]);
      }
    }
    setOpen(false);
    setSelectedIdx(-1);
  };

  const handleKeyDown = (key: string, blur: () => void) => {
    if (key === "Escape") {
      setOpen(false);
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
        setOpen(false);
        setSelectedIdx(-1);
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <div ref={anchorElRef}>
        <MatTextField
          fullWidth
          name={name}
          inputRef={inputRef}
          variant={outlined ? "outlined" : "standard"}
          helperText={(dirty && invalid) || description}
          error={dirty && invalid !== null}
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
                <IconButton disabled={disabled} edge="end">
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {!loading && !!value && (
                    <IconButton
                      edge="end"
                      disabled={disabled}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleChange("");
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            pattern: inputPattern,
          }}
          type={inputType}
          focused={autoFocus}
          autoComplete={autoComplete}
          value={String(value || "")}
          placeholder={placeholder}
          onChange={({ target }) => handleChange(target.value)}
          onClick={() => setOpen(true)}
          label={title}
          disabled={disabled}
        />
      </div>
      <Popover
        open={open}
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
        {open && (
          <VirtualView
            component={List}
            sx={{
              width: `${anchorElRef.current?.clientWidth || 500}px !important`,
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
                    setOpen(false);
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
