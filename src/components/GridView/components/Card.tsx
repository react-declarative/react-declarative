import * as React from "react";

import { SxProps, alpha } from "@mui/material/styles";
import { makeStyles } from "../../../styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PaperView from "../../PaperView";

import classNames from "../../../utils/classNames";

import IAnything from "../../../model/IAnything";

const LABEL_CLASS = "react-declarative__gridViewLabel";

/**
 * Returns the object of styles for a component.
 * @param theme - The theme object.
 * @returns The styles for the component.
 */
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

/**
 * Represents the properties for the `Card` component.
 *
 * @template P - The type for the payload data.
 * @property [label] - The label for the card.
 * @property [outlinePaper] - Whether to show the card with an outline paper.
 * @property [transparentPaper] - Whether to show the card with a transparent paper.
 * @property [sx] - The styling props for the card.
 * @property [children] - The content of the card.
 * @property [className] - The CSS class name for the card.
 * @property [payload] - The payload data.
 * @property loading - Whether the card is in a loading state.
 * @property [style] - The inline style for the card.
 * @property [BeforeLabel] - The component to render before the label.
 * @property [AfterLabel] - The component to render after the label.
 */
export interface ICardProps<P = IAnything> {
  label?: React.ReactNode;
  outlinePaper?: boolean;
  transparentPaper?: boolean;
  sx?: SxProps<any>;
  children?: React.ReactNode;
  className?: string;
  payload?: P;
  loading: boolean;
  style?: React.CSSProperties;
  BeforeLabel?: React.ComponentType<{ payload: P; loading: boolean }>;
  AfterLabel?: React.ComponentType<{ payload: P; loading: boolean }>;
}

/**
 * Represents a Card component.
 *
 * @typedef Card
 * @property children - The content of the card.
 * @property outlinePaper - Whether to show an outline paper.
 * @property transparentPaper - Whether to show a transparent paper.
 * @property className - Additional CSS class names for the card.
 * @property style - Additional inline styles for the card.
 * @property sx - Custom styles for Scalable Box component.
 * @property label - The label for the card.
 * @property payload - Payload data associated with the card.
 * @property loading - Whether the card is in a loading state.
 * @property BeforeLabel - The component to render before the label.
 * @property AfterLabel - The component to render after the label.
 *
 * @param props - The properties passed to the Card component.
 * @returns - The rendered Card component.
 */
export const Card = ({
  children = null,
  outlinePaper,
  transparentPaper,
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
    <PaperView
      className={classNames(classes.root, className)}
      outlinePaper={outlinePaper}
      transparentPaper={transparentPaper}
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
    </PaperView>
  );
};

export default Card;
