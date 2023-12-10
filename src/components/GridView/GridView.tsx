import * as React from "react";
import { SxProps } from "@mui/system";

import Card, { ICardProps } from "./components/Card";
import Grid, { IGridProps, RowData } from "../Grid";

interface IGridViewProps<T = RowData> extends IGridProps<T> {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  label?: ICardProps["label"];
  BeforeLabel?: ICardProps["BeforeLabel"];
  AfterLabel?: ICardProps["AfterLabel"];
}

export const GridView = ({
  className,
  style,
  sx,
  label,
  BeforeLabel,
  AfterLabel,
  ...otherProps
}: IGridViewProps) => (
  <Card
    className={className}
    style={style}
    sx={sx}
    label={label}
    BeforeLabel={BeforeLabel}
    AfterLabel={AfterLabel}
  >
    <Grid {...otherProps} />
  </Card>
);

export default GridView;
