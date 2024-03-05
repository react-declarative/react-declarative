import { SxProps } from "@mui/material";

import IAnything from "../../../model/IAnything";
import SelectionMode from '../../../model/SelectionMode';
import TSubject from "../../../model/TSubject";

import ITile from "./ITile";

export interface ITileProps<Data = IAnything, Payload = IAnything> {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  loading?: boolean;
  hasMore?: boolean;
  errorMessage?: string | null;
  bufferSize?: number;
  minRowHeight?: number;
  children: React.ComponentType<ITile<Data, Payload>>;
  rowKey?: string | number | symbol;
  payload?: Payload | (() => Payload);
  data: Data[];
  onSkip?: (initial: boolean) => void;
  onButtonSkip?: () => void;
  onItemClick?: (item: { data: Data, payload: Payload }) => void;
  selectionMode?: SelectionMode;
  recomputeSubject?: TSubject<void>;
  rowMark?: ((row: Data) => string) | ((row: Data) => Promise<string>);
  rowColor?: (row: Data) => string;
  onSelectedRows?: (rowIds: string[], initialChange: boolean) => void;
  selectedRows?: string[];
}

export default ITileProps;
