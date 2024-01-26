import * as React from "react";
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { makeStyles } from "../../../styles";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ListSubheader from "@mui/material/ListSubheader";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import debounce from "../../../utils/hof/debounce";

import ISearchInputProps from "../model/ISearchInputProps";

const useStyles = makeStyles()((theme) => ({
  listHeader: {
    background: "transparent",
    paddingTop: theme.spacing(1.5),
  },
}));

const SEARCH_DEBOUNCE = 1_500;

export const SearchInput = ({
  type,
  mode,
  pattern,
  getValue,
  loading,
  placeholder,
  autoComplete,
  onTextChange,
  reloadSubject,
}: ISearchInputProps) => {
  const { classes } = useStyles();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => reloadSubject.subscribe(() => {
    const { current: input } = inputRef;
    if (input) {
      input.focus();
      input.value = getValue();
    }
  }), []);

  useEffect(() => {
    const { current: input } = inputRef;
    if (!loading && input) {
      input.focus();
      input.value = getValue();
    }
  }, [loading]);

  const emitChangeSearch = useMemo(
    () =>
      debounce(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          onTextChange(e.target.value);
        },
        SEARCH_DEBOUNCE
      ),
    []
  );

  useEffect(() => () => {
    emitChangeSearch.flush();
  }, []);

  const handleKeySearch = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Escape") {
        e.stopPropagation();
      }
    },
    []
  );

  return (
    <ListSubheader className={classes.listHeader}>
      <TextField
        inputRef={inputRef}
        type={type}
        variant="standard"
        autoFocus
        fullWidth
        disabled={loading}
        defaultValue={getValue}
        autoComplete={autoComplete}
        placeholder={placeholder}
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
        onChange={emitChangeSearch}
        onKeyDown={handleKeySearch}
        sx={{ mb: 1 }}
      />
    </ListSubheader>
  );
};

export default SearchInput;