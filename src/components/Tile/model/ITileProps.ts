import { SxProps } from "@mui/material";

import IAnything from "../../../model/IAnything";
import SelectionMode from '../../../model/SelectionMode';
import TSubject from "../../../model/TSubject";

import ITile from "./ITile";
import TileMode from "./TileMode";

/**
 * Represents the properties required for the `ITile` component.
 *
 * @template Data - The type of data used in the tile.
 * @template Payload - The type of payload used in the tile.
 */
export interface ITileProps<Data = IAnything, Payload = IAnything> {
  withHeader?: boolean;
  headerLabel?: string;
  mode?: TileMode;
  noDataLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  itemSx?: SxProps<any>;
  loading?: boolean;
  hasMore?: boolean;
  scrollYSubject?: TSubject<number>;
  scrollXSubject?: TSubject<number>;
  errorMessage?: string | null;
  bufferSize?: number;
  minRowHeight?: number;
  children: React.ComponentType<ITile<Data, Payload>>;
  rowKey?: string | number | symbol;
  payload?: Payload | (() => Payload);
  data: Data[];
  onSkip?: (initial: boolean) => void;
  onButtonSkip?: () => void;
  onItemClick?: (item: { data: Data, payload: Payload, isSelected: boolean, toggleSelection: () => void }) => void;
  selectionMode?: SelectionMode;
  recomputeSubject?: TSubject<void>;
  rowMark?: ((row: Data) => string) | ((row: Data) => Promise<string>);
  rowColor?: ((row: Data) => string) | ((row: Data) => Promise<string>);
  onSelectedRows?: (rowIds: string[], initialChange: boolean) => void;
  selectedRows?: string[];
}

export default ITileProps;
