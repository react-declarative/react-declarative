import * as React from "react";
import { useState } from "react";
import { SxProps } from "@mui/system";

import InputBase from "@mui/material/InputBase";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";

interface ISearchProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
}

export const Search = ({
  className,
  style,
  sx,
}: ISearchProps) => {
  const [filterText, setFilterText] = useState("");
  return (
    <InputBase
      className={className}
      style={style}
      sx={{
        height: '100%',
        ...sx
      }}
      fullWidth
      onChange={({ target }) => setFilterText(target.value.toString())}
      value={filterText}
      placeholder="Search"
      autoComplete="off"
      endAdornment={!!filterText ? (
        <InputAdornment position="end">
          <div style={{ marginRight: -10 }}>
            <IconButton onClick={() => setFilterText("")}>
              <CloseIcon />
            </IconButton>
          </div>
        </InputAdornment>
      ) : undefined}
      name="search"
      type="text"
    />
  );
};

export default Search;
