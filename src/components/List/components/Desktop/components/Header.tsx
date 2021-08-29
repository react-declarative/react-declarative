import * as React from "react";
import { makeStyles } from "@material-ui/core";

import { GridColumnHeaderParams } from "@material-ui/data-grid";

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
    opacity: 0.5,
    overflow: "hidden",
  },
}));

type IHeaderProps = GridColumnHeaderParams;

export const Header = ({
  colDef,
}: IHeaderProps) => {
  const classes = useStyles();
  const { headerName } = colDef || {};
  return (
    <AutoSizer disableHeight className={classes.root}>
      {({ width, height }) => (
        <div className={classes.container}>
          <div
            className={classes.content}
            style={{ width: width - 25, maxHeight: Math.max(height, 25) }}
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
