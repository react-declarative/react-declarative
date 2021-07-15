import * as React from "react";
import { makeStyles } from "@material-ui/core";

import { GridCellParams } from "@material-ui/data-grid";

import Checkbox from "@material-ui/core/Checkbox";

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
