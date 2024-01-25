import * as React from "react";

import { makeStyles } from "../../../styles";

import MenuItem from "@mui/material/MenuItem";

const useStyles = makeStyles()({
  item: {
    whiteSpace: "break-spaces",
  },
});

export const SearchCreate = () => {
  const { classes } = useStyles();
  return (
    <MenuItem className={classes.item}>
      Create item
    </MenuItem>
  );
};

export default SearchCreate;
