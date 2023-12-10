import * as React from "react";

import { SxProps, alpha } from "@mui/material/styles";
import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import classNames from "../../../utils/classNames";

import IAnything from "../../../model/IAnything";

const LABEL_CLASS = "react-declarative__gridViewLabel";

const useStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    background: theme.palette.background.paper,
  },
  label: {
    display: "flex",
    minHeight: "35px",
    justifyContent: "stretch",
    alignItems: "center",
    paddingLeft: "6px",
    gap: theme.spacing(1),
    background: alpha("#000", 0.1),
  },
  labelTitle: {
    opacity: 0.5,
  },
  container: {
    position: "relative",
    flex: 1,
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    "& > *": {
      flex: 1,
    },
  },
  stretch: {
    flex: 1,
  },
}));

export interface ICardProps<P = IAnything> {
  label?: React.ReactNode;
  sx?: SxProps;
  children?: React.ReactNode;
  className?: string;
  payload?: P;
  loading: boolean;
  style?: React.CSSProperties;
  BeforeLabel?: React.ComponentType<{ payload: P; loading: boolean }>;
  AfterLabel?: React.ComponentType<{ payload: P; loading: boolean }>;
}

export const Card = ({
  children = null,
  className,
  style,
  sx,
  label,
  payload,
  loading,
  BeforeLabel,
  AfterLabel,
}: ICardProps) => {
  const { classes } = useStyles();
  return (
    <Paper
      className={classNames(classes.root, className)}
      sx={sx}
      style={style}
    >
      {!!label && (
        <Box className={classNames(classes.label, LABEL_CLASS)}>
          {!!BeforeLabel && <BeforeLabel payload={payload} loading={loading} />}
          <Typography className={classes.labelTitle}>{label}</Typography>
          <div className={classes.stretch} />
          {!!AfterLabel && <AfterLabel payload={payload} loading={loading} />}
        </Box>
      )}
      <div className={classes.container}>
        <div className={classes.content}>{children}</div>
      </div>
    </Paper>
  );
};

export default Card;
