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
  stretch: {
    flex: 1,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
  },
  adjust: {
    maxHeight: 10,
    minHeight: 10,
  },
});

/**
 * Represents the properties of the Card component.
 */
export interface ICardProps extends IContainerProps {
  className?: string;
  style?: React.CSSProperties;
  onDrag: (id: string) => void;
}

/**
 * Represents a Card component.
 * @param {Object} props - The props of the Card component.
 * @param {string} props.className - The CSS class name of the Card component.
 * @param {Object} props.style - The inline styles of the Card component.
 * @param {boolean} props.disabled - Determines if the Card component is disabled.
 * @param {string} props.id - The unique identifier of the Card component.
 * @param {function} props.onDrag - The event handler for the onDrag event of the Card component.
 * @param {React.Ref} ref - The reference object for the Card component.
 * @returns {React.Element} The rendered Card component.
 */
export const Card = forwardRef(
  (
    { className, style, disabled, id, onDrag, ...otherProps }: ICardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { classes } = useStyles();
    return (
      <Box
        className={classNames(classes.root, className)}
        style={style}
        ref={ref}
      >
        <div
          className={classes.stretch}
          data-cardid={id}
          onDrag={() => {
            if (!disabled) {
              onDrag(id);
            }
          }}
          draggable={disabled ? "false" : "true"}
        >
          <Container id={id} disabled={disabled} {...otherProps} />
        </div>
        <div className={classes.adjust} />
      </Box>
    );
  }
);

export default Card;
