import dayjs from "dayjs";
import { SxProps } from "@mui/material";

import ICalendarRequest from "./ICalendarRequest";
import ICalendarItem from "./ICalendarItem";
import ICalendarTile from "./ICalendarTile";

import { stamp } from "../../../utils/getMomentStamp";

import IAnything from "../../../model/IAnything";
import TSubject from "../../../model/TSubject";

export interface ICalendarViewProps<
  Data extends IAnything = IAnything,
  Payload extends IAnything = IAnything
> {
  reloadSubject?: TSubject<void>;
  dotSide?: number;
  outlinePaper?: boolean;
  transparent?: boolean;
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
    | ((req: ICalendarRequest<Payload>) => Omit<ICalendarItem<Data, Payload>, 'payload'>[])
    | ((req: ICalendarRequest<Payload>) => Promise<Omit<ICalendarItem<Data, Payload>, 'payload'>[]>);
  payload?: Payload | (() => Payload);
  date?: dayjs.Dayjs;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  onChange?: (date: dayjs.Dayjs | null) => void;
  renderItem: React.ComponentType<ICalendarTile<Data, Payload>>;
  onItemClick: (item: { data: Data, payload: Payload }) => void;
  rowMark?: ((row: Data) => string) | ((row: Data) => Promise<string>);
  rowColor?: (row: Data) => string;
}

export default ICalendarViewProps;
