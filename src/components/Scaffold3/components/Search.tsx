import * as React from "react";
import { SxProps } from "@mui/material";

import InputBase from "@mui/material/InputBase";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import useStateContext from "../context/StateContext";
import usePreventAutofill from "../../../hooks/usePreventAutofill";

import CloseIcon from "@mui/icons-material/Close";

/**
 * Interface for Search component props.
 */
interface ISearchProps {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
}

/**
 * Search component
 *
 * @param props - The props object.
 * @param props.className - The class name for the component.
 * @param props.style - The style object for the component.
 * @param props.sx - Additional inline style for the component.
 * @returns The Search component.
 */
export const Search = ({
  className,
  style,
  sx,
}: ISearchProps) => {
  const { searchText, setSearchText } = useStateContext();
  const preventAutofill = usePreventAutofill();
  return (
    <InputBase
      className={className}
      style={style}
      sx={{
        height: '100%',
        ...sx
      }}
      fullWidth
      onChange={({ target }) => setSearchText(target.value.toString())}
      value={searchText}
      placeholder="Search"
      autoComplete="off"
      endAdornment={!!searchText ? (
        <InputAdornment position="end">
          <div style={{ marginRight: -10 }}>
            <IconButton onClick={() => setSearchText("")}>
              <CloseIcon />
            </IconButton>
          </div>
        </InputAdornment>
      ) : undefined}
      name="search"
      type="text"
      {...preventAutofill}
    />
  );
};

export default Search;
