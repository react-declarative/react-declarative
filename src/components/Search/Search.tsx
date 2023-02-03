import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import { SxProps } from "@mui/system";

import Box from '@mui/material/Box';
import Select, { SelectProps } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from '@mui/icons-material/Search';

interface ISearchProps extends Omit<SelectProps, keyof {
  onChange: never;
}> {
  items: {
    value: string;
    label: string;
  }[];
  value?: string;
  sx?: SxProps;
  onChange: (value: string) => void;
}

export const Search = ({
  items,
  value,
  label,
  onChange,
  sx,
  ...props
}: ISearchProps) => {

  const [searchText, setSearchText] = useState("");

  const options = useMemo(
    () => items.filter((item) => (item.label, searchText)),
    [items, searchText]
  );

  const components = useMemo(() => ({
    Root: Box,
  }), []);

  const handleCloseSelect = useCallback(() => {
    setSearchText("");
  }, []);

  const handleChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchText(e.target.value);
    },
    []
  );

  const handleKeySearch = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Escape") {
      e.stopPropagation();
    }
  }, []);

  const handleChange = useCallback((value: string) => {
    onChange && onChange(value);
  }, [onChange]);

  return (
    <Select
      components={components}
      MenuProps={{ autoFocus: false }}
      value={value}
      onChange={(e: any) => handleChange(e.target.value)}
      onClose={handleCloseSelect}
      renderValue={() => value}
      {...props}
      sx={{
        minWidth: 150,
        ...sx,
      }}
    >
      <ListSubheader>
        <TextField
          autoFocus
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={handleChangeSearch}
          onKeyDown={handleKeySearch}
        />
      </ListSubheader>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default Search;
