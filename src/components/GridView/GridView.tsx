import * as React from "react";
import { SxProps } from "@mui/material";

import { makeStyles } from "../../styles";

import Card, { ICardProps } from "./components/Card";
import Grid, { IGridProps, RowData } from "../Grid";
import Tile, { ITileProps } from "../Tile";

import useSingleton from "../../hooks/useSingleton";
import useMediaContext from "../../hooks/useMediaContext";

import IAnything from "../../model/IAnything";

/**
 * Interface for GridView component props.
 *
 * @template T - Type of the row data.
 * @template P - Type of the additional props.
 */
interface IGridViewProps<T = RowData, P = IAnything> extends IGridProps<T, P> {
  className?: string;
  style?: React.CSSProperties;
  outlinePaper?: boolean;
  transparentPaper?: boolean;
  sx?: SxProps<any>;
  label?: ICardProps["label"];
  mobileItem?: ITileProps<T>["children"];
  BeforeLabel?: ICardProps["BeforeLabel"];
  AfterLabel?: ICardProps["AfterLabel"];
}

/**
 * A function that returns an object with CSS styles.
 *
 * @returns {Object} The object containing CSS styles.
 */
const useStyles = makeStyles()({
  tile: {
    height: "100%",
  },
});

/**
 * Represents a GridView component.
 *
 * @template T - The type of RowData.
 * @template P - The type of IAnything.
 *
 * @param props - The component props.
 * @returns - The GridView component.
 */
export const GridView = <
  T extends RowData = RowData,
  P extends IAnything = IAnything
>({
  className,
  style,
  sx,
  label,
  BeforeLabel,
  AfterLabel,
  payload: upperPayload,
  mobileItem: MobileItem,
  outlinePaper,
  transparentPaper,
  loading,
  ...otherProps
}: IGridViewProps<T, P>) => {
  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  const { isMobile } = useMediaContext();

  /**
   * Renders the inner content based on the condition.
   *
   * @returns - The rendered content.
   */
  const renderInner = () => {
    if (isMobile && MobileItem) {
      return (
        <Tile
          {...otherProps}
          className={classes.tile}
          payload={payload}
          loading={loading}
        >
          {MobileItem}
        </Tile>
      );
    }
    return <Grid {...otherProps} payload={payload} loading={loading} />;
  };

  return (
    <Card
      outlinePaper={outlinePaper}
      transparentPaper={transparentPaper}
      className={className}
      style={style}
      sx={sx}
      label={label}
      payload={payload}
      loading={!!loading}
      BeforeLabel={BeforeLabel}
      AfterLabel={AfterLabel}
    >
      {renderInner()}
    </Card>
  );
};

export default GridView;
