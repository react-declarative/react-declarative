import * as React from "react";

import { makeStyles } from "../../../styles";

import MenuItem from "@mui/material/MenuItem";

const useStyles = makeStyles()({
  item: {
    whiteSpace: "break-spaces",
  },
});

/**
 * Function to create a search item.
 *
 * @returns The created search item.
 */
export const SearchCreate = () => {
  const { classes } = useStyles();
  return (
    <MenuItem className={classes.item}>
      Create item
    </MenuItem>
  );
};

export default SearchCreate;
