import * as React from "react";

import { makeStyles } from "../../../../../styles";

import { GridCellParams } from "@mui/x-data-grid";

import AutoSizer from "../../../../common/AutoSizer";

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
    border: "3px solid transparent",
    overflow: "hidden",
  },
}));

type ITextCellProps = GridCellParams;

export const TextCell = ({ formattedValue }: ITextCellProps) => {
  const classes = useStyles();
  return (
    <AutoSizer className={classes.root}>
      {({ width, height }) => (
        <div className={classes.container}>
          <pre
            className={classes.content}
            style={{ width: width - 25, maxHeight: height }}
          >
            {formattedValue}
          </pre>
        </div>
      )}
    </AutoSizer>
  );
};

export const renderTextCell = (props: ITextCellProps) => {
  return <TextCell {...props} />;
};

export default TextCell;
