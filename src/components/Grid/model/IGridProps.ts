import React from 'react';
import { SxProps } from '@mui/system';

import IColumn from './IColumn';
import RowData from './RowData';
import IGridAction from './IGridAction';
import TSort from './TSort';

import { IVirtualViewProps } from '../../VirtualView';
import { IActionMenuProps } from '../../ActionMenu';

import { TSubject } from '../../../utils/rx/Subject';

export interface IGridProps<T = RowData> {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  header?: React.ReactNode;
  data: Array<T>;
  columns: Array<IColumn<T>>;
  scrollXSubject?: TSubject<number>;
  scrollYSubject?: TSubject<number>; 
  onTableRowClick?: (evt: React.MouseEvent, row: T) => void;
  rowActions?: Array<IGridAction<T>>;
  rowActionsPayload?: IActionMenuProps['payload'];
  onRowAction?: (row: T, action: string) => void;
  recomputeSubject?: TSubject<void>;
  loading?: boolean;
  hasMore?: boolean;
  rowMark?: ((row: RowData) => string) | ((row: RowData) => Promise<string>);
  onSkip?: (initial: boolean) => void;
  onButtonSkip?: () => void;
  rowKey?: keyof T;
  sort?: TSort<T>;
  errorMessage?: string | null;
  onClickHeaderColumn?: (value: keyof T) => void;
  minRowHeight?: IVirtualViewProps['minRowHeight'];
  bufferSize?: IVirtualViewProps['bufferSize'];
  shortHeight?: boolean;
}

export default IGridProps;
