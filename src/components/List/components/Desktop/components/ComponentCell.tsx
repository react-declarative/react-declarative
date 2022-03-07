import * as React from "react";
import { Fragment } from "react";
import { makeStyles } from "../../../../../styles";

import { GridCellParams } from "@mui/x-data-grid";

import { useProps } from "../../PropProvider";

import { INTERNAL_COLUMN_NAME } from "../config";

const useStyles = makeStyles({
  root: {
    position: "relative",
    height: '100%',
    width: '100%',
    marginLeft: -10,
    marginRight: -10,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    lineHeight: 'initial',
    '& > *': {
      flex: 1,
    },
  },
});

type IComponentCellProps = GridCellParams;

export const ComponentCell = ({ row, field }: IComponentCellProps) => {
  const classes = useStyles();

  const listProps = useProps();

  const {
    columns = [],
  } = listProps;

  const {
    element: Element = () => <Fragment />,
  } = columns.find((col) => col.field === field || col[INTERNAL_COLUMN_NAME] === field) || {};

  return (
    <div className={classes.root}>
      <Element {...row} />
    </div>
  );
};

export const renderComponentCell = (props: IComponentCellProps) => {
  return <ComponentCell {...props} />;
};

export default ComponentCell;
