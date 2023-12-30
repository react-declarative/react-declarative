import * as React from "react";

import { makeStyles } from "../../../styles";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import Header, { IHeaderProps } from "./Header";
import Content, { IContentProps } from "./Content";

import IAnything from "../../../model/IAnything";

export interface IContainerProps extends IHeaderProps, IContentProps {
  AfterCardContent?: React.ComponentType<{ id: string; payload: IAnything }>;
}

const useStyles = makeStyles()((theme) => ({
  container: {
    position: "relative",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flex: 1,
  },
  content: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
    overflow: "hidden",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    maxWidth: 255,
    flex: 1,
  },
}));

export const Container = ({
  id,
  column,
  label,
  columns,
  rows,
  disabled,
  onChangeColumn,
  onCardLabelClick,
  payload,
  AfterCardContent,
}: IContainerProps) => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.container}>
      <Box className={classes.content}>
        <Header
          id={id}
          column={column}
          columns={columns}
          disabled={disabled}
          onChangeColumn={onChangeColumn}
          onCardLabelClick={onCardLabelClick}
          payload={payload}
          label={label}
        />
        <Content id={id} payload={payload} rows={rows} />
        {AfterCardContent && <AfterCardContent id={id} payload={payload} />}
      </Box>
    </Paper>
  );
};

export default Container;
