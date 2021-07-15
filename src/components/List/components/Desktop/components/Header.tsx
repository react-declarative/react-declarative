import * as React from "react";
import { makeStyles } from "@material-ui/core";

import { GridColumnHeaderParams } from "@material-ui/data-grid";

import AutoSizer from "../../../../common/AutoSizer";

const useStyles = makeStyles({
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
    color: "#707070",
    border: "3px solid transparent",
    overflow: "hidden",
  },
});

type IHeaderProps = GridColumnHeaderParams;

export const Header = ({
  colDef = {},
}: IHeaderProps) => {
  const classes = useStyles();
  const { headerName } = colDef;
  return (
    <AutoSizer className={classes.root}>
      {({ width, height }) => (
        <div className={classes.container}>
          <div
            className={classes.content}
            style={{ width: width - 25, maxHeight: height }}
          >
            {headerName}
          </div>
        </div>
      )}
    </AutoSizer>
  );
};

export const renderHeader = (props: IHeaderProps) => {
  return <Header {...props} />;
};

export default Header;
