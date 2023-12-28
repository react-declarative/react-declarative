import * as React from "react";
import { SxProps } from "@mui/material";

import Card, { ICardProps } from "./components/Card";
import Grid, { IGridProps, RowData } from "../Grid";

import useSingleton from "../../hooks/useSingleton";

import IAnything from "../../model/IAnything";

interface IGridViewProps<T = RowData, P = IAnything> extends IGridProps<T, P> {
  className?: string;
  style?: React.CSSProperties;
  outlinePaper?: boolean;
  sx?: SxProps;
  label?: ICardProps["label"];
  BeforeLabel?: ICardProps["BeforeLabel"];
  AfterLabel?: ICardProps["AfterLabel"];
}

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
  outlinePaper,
  loading,
  ...otherProps
}: IGridViewProps<T, P>) => {
  const payload = useSingleton(upperPayload);
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
      <Grid {...otherProps} payload={payload} loading={loading} />
    </Card>
  );
};

export default GridView;
