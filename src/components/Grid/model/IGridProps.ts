import React from 'react';
import { SxProps } from '@mui/material';

import IColumn from './IColumn';
import RowData from './RowData';
import IGridAction from './IGridAction';
import IAnything from '../../../model/IAnything';
import TSort from './TSort';

import { IVirtualViewProps } from '../../VirtualView';

import { TSubject } from '../../../utils/rx/Subject';
import SelectionMode from '../../../model/SelectionMode';

/**
 * Represents the properties of the IGrid component.
 *
 * @template T - The type of the RowData.
 * @template P - The type of the payload.
 */
export interface IGridProps<T = RowData, P = IAnything> {
  outlinePaper?: boolean;
  transparentPaper?: boolean;
  noDataLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<any>;
  header?: React.ReactNode;
  data: Array<T>;
  columns: Array<IColumn<T, P>>;
  scrollXSubject?: TSubject<number>;
  scrollYSubject?: TSubject<number>; 
  onTableRowClick?: (evt: React.MouseEvent, row: T) => void;
  onRowClick?: (row: T) => void;
  rowActions?: Array<IGridAction<T>>;
  payload?: P | (() => P);
  onRowAction?: (action: string, row: T) => void;
  recomputeSubject?: TSubject<void>;
  loading?: boolean;
  hasMore?: boolean;
  rowMark?: ((row: RowData) => string) | ((row: RowData) => Promise<string>);
  rowColor?: ((row: RowData) => string) | ((row: RowData) => Promise<string>);
  onSkip?: (initial: boolean) => void;
  onButtonSkip?: () => void;
  rowKey?: keyof T;
  sort?: TSort<T>;
  errorMessage?: string | null;
  selectionMode?: SelectionMode;
  onClickHeaderColumn?: (value: keyof T) => void;
  onSelectedRows?: (rowIds: string[], initialChange: boolean) => void;
  selectedRows?: string[];
  minRowHeight?: IVirtualViewProps['minRowHeight'];
  bufferSize?: IVirtualViewProps['bufferSize'];
}

export default IGridProps;
