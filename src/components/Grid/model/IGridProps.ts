import React from 'react';
import { SxProps } from '@mui/system';

import IColumn from './IColumn';
import RowData from './RowData';
import IListRowAction from './IListRowAction';
import TSort from './TSort';

import { IVirtualViewProps } from '../../VirtualView';
import { IActionMenuProps } from '../../ActionMenu';

import Subject from '../../../utils/rx/Subject';

export interface IGridProps<T = RowData> {
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps;
  data: Array<T>;
  columns: Array<IColumn<T>>;
  onTableRowClick?: (evt: React.MouseEvent, row: T) => void;
  rowActions?: Array<IListRowAction<T>>;
  rowActionsPayload?: IActionMenuProps['payload'];
  onRowAction?: (row: T, action: string) => void;
  recomputeSubject?: Subject<void>;
  loading?: boolean;
  hasMore?: boolean;
  onSkip?: () => void;
  onButtonSkip?: () => void;
  rowKey?: keyof T;
  sort?: TSort<T>;
  errorMessage?: string | null;
  onClickHeaderColumn?: (value?: IColumn<T>['field']) => void;
  minRowHeight?: IVirtualViewProps['minHeight'];
  bufferSize?: IVirtualViewProps['bufferSize'];
  shortHeight?: boolean;
}

export default IGridProps;
