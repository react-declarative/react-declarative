import * as React from "react";
import { SxProps } from "@mui/material";

import { makeStyles } from "../../styles";

import Card, { ICardProps } from "./components/Card";
import Grid, { IGridProps, RowData } from "../Grid";
import Tile, { ITileProps } from "../Tile";

import useSingleton from "../../hooks/useSingleton";
import useMediaContext from "../../hooks/useMediaContext";

import IAnything from "../../model/IAnything";

interface IGridViewProps<T = RowData, P = IAnything> extends IGridProps<T, P> {
  className?: string;
  style?: React.CSSProperties;
  outlinePaper?: boolean;
  sx?: SxProps<any>;
  label?: ICardProps["label"];
  mobileItem?: ITileProps<T>["children"];
  BeforeLabel?: ICardProps["BeforeLabel"];
  AfterLabel?: ICardProps["AfterLabel"];
}

const useStyles = makeStyles()({
  tile: {
    height: "100%",
  },
});

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
  loading,
  ...otherProps
}: IGridViewProps<T, P>) => {
  const { classes } = useStyles();

  const payload = useSingleton(upperPayload);

  const { isMobile } = useMediaContext();

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
