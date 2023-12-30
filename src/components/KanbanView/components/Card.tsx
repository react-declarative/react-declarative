import * as React from "react";
import { forwardRef } from "react";

import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";

import Container, { IContainerProps } from "./Container";

import classNames from "../../../utils/classNames";

const useStyles = makeStyles()({
  root: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column",
  },
  adjust: {
    maxHeight: 10,
    minHeight: 10,
    flex: 1,
  },
});

export interface ICardProps extends IContainerProps {
  className?: string;
  style?: React.CSSProperties;
  onDrag: (id: string) => void;
}

export const Card = forwardRef(
  (
    { className, style, disabled, id, onDrag, ...otherProps }: ICardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { classes } = useStyles();
    return (
      <Box
        data-cardid={id}
        className={classNames(classes.root, className)}
        onDrag={() => {
          if (!disabled) {
            onDrag(id);
          }
        }}
        style={style}
        ref={ref}
        draggable={!disabled ? "true" : "false"}
      >
        <Container id={id} disabled={disabled} {...otherProps} />
        <div className={classes.adjust} />
      </Box>
    );
  }
);

export default Card;
