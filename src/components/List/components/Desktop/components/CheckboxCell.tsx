import * as React from "react";
import { makeStyles } from "../../../../../styles";

import { GridCellParams } from "@mui/x-data-grid";

import Checkbox from "@mui/material/Checkbox";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
  },
});

type ICheckBoxCellProps = GridCellParams;

export const CheckBoxCell = ({ formattedValue }: ICheckBoxCellProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Checkbox
        disabled
        checked={!!formattedValue}
      />
    </div>
  );
};

export const renderCheckBoxCell = (props: ICheckBoxCellProps) => {
  return <CheckBoxCell {...props} />;
};

export default CheckBoxCell;
