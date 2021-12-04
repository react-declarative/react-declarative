import * as React from "react";
import { makeStyles } from "@material-ui/core";

import { GridCellParams } from "@material-ui/data-grid";

import { useProps } from "../../PropProvider";

import { INTERNAL_COLUMN_NAME } from "../config";

import AutoSizer from "../../../../common/AutoSizer";
import Async from "../../../../common/Async";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: '100%',
  },
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    whiteSpace: "break-spaces",
    overflowWrap: "break-word",
    lineHeight: "20px",
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.getContrastText(theme.palette.background.paper),
    opacity: 0.5,
    overflow: "hidden",
  },
}));

type IComputeCellProps = GridCellParams;

export const ComputeCell = ({ row, field }: IComputeCellProps) => {
  const classes = useStyles();

  const listProps = useProps();

  const {
    columns = [],
    fallback = () => null,
  } = listProps;

  const {
    compute = (_: any) => '',
  } = columns.find((col) => col.field === field || col[INTERNAL_COLUMN_NAME] === field) || {};

  return (
    <AutoSizer className={classes.root} payload={row}>
      {({ width, height }) => (
        <div className={classes.container}>
          <pre
            className={classes.content}
            style={{ width: width - 25, maxHeight: height }}
          >
            <Async payload={row} fallback={fallback}>
              {(row) => compute(row)}
            </Async>
          </pre>
        </div>
      )}
    </AutoSizer>
  );
};

export const renderComputeCell = (props: IComputeCellProps) => {
  return <ComputeCell {...props} />;
};

export default ComputeCell;
