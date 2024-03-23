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

/**
 * Represents a search input component.
 *
 * @param SearchInput - The search input configuration.
 * @param SearchInput.type - The type of input.
 * @param SearchInput.mode - The input mode.
 * @param SearchInput.pattern - The input pattern.
 * @param SearchInput.getValue - A function that returns the current value of the input.
 * @param SearchInput.loading - Specifies if the search is currently loading.
 * @param SearchInput.placeholder - The placeholder text for the input.
 * @param SearchInput.autoComplete - Specifies if the input has auto-completion enabled.
 * @param SearchInput.onTextChange - The callback function when the input text changes.
 * @param SearchInput.reloadSubject - The subject for reloading the search input.
 */
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

  /**
   * A memoized debounced function that is used for handling onChange events in search functionality.
   *
   * @name emitChangeSearch
   * @type {Function}
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The event triggered by a change in the input or textarea element.
   * @returns {void}
   */
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

  /**
   * Handle key search function.
   *
   * @param {React.KeyboardEvent<HTMLDivElement>} e - The keyboard event.
   * @returns {void}
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
