import dayjs from "dayjs";
import { SxProps } from "@mui/material";

import ICalendarRequest from "./ICalendarRequest";
import ICalendarItem from "./ICalendarItem";
import ICalendarTile from "./ICalendarTile";

import { stamp } from "../../../utils/getMomentStamp";

import IAnything from "../../../model/IAnything";

export interface ICalendarViewProps<
  Data extends IAnything = IAnything,
  Payload extends IAnything = IAnything
> {
  BeforeCalendarHeader?: React.ComponentType<{
    fromStamp: stamp;
    toStamp: stamp;
    payload: Payload;
  }>;
  AfterCalendarHeader?: React.ComponentType<{
    fromStamp: stamp;
    toStamp: stamp;
    payload: Payload;
  }>;
  BeforeDayHeader?: React.ComponentType<{
    stamp: stamp;
    items: ICalendarItem<Data, Payload>[];
    payload: Payload;
  }>;
  AfterDayHeader?: React.ComponentType<{
    stamp: stamp;
    items: ICalendarItem<Data, Payload>[];
    payload: Payload;
  }>;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  fallback?: (e: Error) => void;
  onLoadStart?: () => void;
  onLoadEnd?: (isOk: boolean) => void;
  throwError?: boolean;
  handler:
    | ((req: ICalendarRequest<Payload>) => ICalendarItem<Data, Payload>[])
    | ((req: ICalendarRequest<Payload>) => Promise<ICalendarItem<Data, Payload>[]>);
  payload: Payload | (() => Payload);
  date?: dayjs.Dayjs;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  onChange: (date: dayjs.Dayjs | null) => void;
  renderItem: React.ComponentType<ICalendarTile<Data, Payload>>;
  rowMark?: ((row: Data) => string) | ((row: Data) => Promise<string>);
  rowColor?: (row: Data) => string;
}

export default ICalendarViewProps;
