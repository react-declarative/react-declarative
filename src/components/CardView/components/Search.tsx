import * as React from "react";
import { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import useStateContext from "../context/StateContext";
import useChangeSubject from "../../../hooks/useChangeSubject";

import debounce from "../../../utils/hof/debounce";

const SEARCH_DEBOUNCE = 1_000;

interface ISearchProps {
  disabled: boolean;
}

export const Search = ({ disabled }: ISearchProps) => {
  const { state, action } = useStateContext();
  const [search, setSearch] = useState(state.search);

  const searchChangeSubject = useChangeSubject(search);

  useEffect(() => {
    const handler = debounce((search: string) => {
      action.setSearch(search);
    }, SEARCH_DEBOUNCE);

    const unlisten = searchChangeSubject.subscribe(handler);

    return () => {
      handler.clear();
      unlisten();
    };
  }, [searchChangeSubject]);

  return (
    <TextField
      variant="standard"
      onChange={({ target }) => setSearch(target.value.toString())}
      disabled={disabled}
      value={search}
      placeholder="Search"
      InputProps={{
        autoComplete: "off",
        endAdornment: (
          <InputAdornment position="end">
            <div style={{ marginRight: -10 }}>
              <IconButton onClick={() => !state.loading && setSearch("")}>
                {(state.search && !state.loading) ? <CloseIcon /> : !state.loading ? <SearchIcon /> : null}
                {state.loading && <CircularProgress size={24} />}
              </IconButton>
            </div>
          </InputAdornment>
        ),
      }}
      name="search"
      type="text"
    />
  );
};

export default Search;
