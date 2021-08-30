import {
  Ref,
} from 'react';

import {
  GridColumns,
  GridSlotsComponent,
  GridSortModel,
} from '@material-ui/data-grid';

import ActionType from './ActionType';
import SelectionMode from './SelectionMode';

import IAnything from './IAnything';
import IRowData from './IRowData';
import IColumn from './IColumn';
import IOption from './IOption';
import IField from './IField';
import IListApi from './IListApi';

export interface IListAction extends Partial<IOption> {
  type: ActionType;
  options?: Partial<IOption>[];
}

interface ComponentProps {
  columnMenuProps?: any;
  errorOverlayProps?: any;
  footerProps?: any;
  headerProps?: any;
  toolbarProps?: any;
  preferencesPanelProps?: any;
  loadingOverlayProps?: any;
  noResultsOverlayProps?: any;
  noRowsOverlayProps?: any;
  paginationProps?: any;
  filterPanelProps?: any;
  columnsPanelProps?: any;
  panelProps?: any;
}

export type ListHandlerResult<RowData extends IRowData = IAnything> = RowData[] | {
  rows: RowData[];
  total: number;
};

export type ListHandlerPagination = {
  limit: number;
  offset: number;
};

export type ListHandlerSortModel = GridSortModel;

export type ListHandler<FilterData = IAnything, RowData extends IRowData = IAnything> = RowData[] | ((
  data: FilterData,
  pagination: ListHandlerPagination,
  sort: ListHandlerSortModel,
) => Promise<ListHandlerResult<RowData>> | ListHandlerResult<RowData>);

export interface IListState<FilterData = IAnything, RowData extends IRowData = IAnything> {
  initComplete: boolean;
  filterData: FilterData;
  isMobile: boolean;
  rows: RowData[];
  rowHeight: number;
  limit: number;
  offset: number;
  total: number | null;
  uniqueKey: string;
  loading: boolean;
  sort: ListHandlerSortModel;
};

export interface IListCallbacks<FilterData = IAnything, RowData extends IRowData = IAnything> {
  handleDefault: ListHandler<FilterData, RowData> | (() => void);
  handleSortModel: (sort: ListHandlerSortModel) => void;
  handleFilter: (data: FilterData) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  ready: () => void;
};

export interface IListProps<
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  Field extends IField = IField<FilterData>,
> extends GridSlotsComponent, ComponentProps {
  ref?: Ref<IListApi>;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  filterLabel?: string;
  actions?: IListAction[];
  limit?: number;
  sizeByParent?: boolean;
  heightRequest?: (height: number) => number;
  widthRequest?: (width: number) => number;
  onSelectedRows?: (rows: RowData[]) => void;
  onFilterChange?: (data: FilterData) => void;
  onSortModelChange?: (sort: ListHandlerSortModel) => void;
  onColumnMenuAction?: (action: string) => void;
  onRowAction?: (row: RowData, action: string) => void;
  onRowClick?: (row: RowData) => void;
  onAction?: (action: string) => void;
  gridColumns?: GridColumns;
  columns?: IColumn<RowData>[];
  filters?: Field[];
  handler: ListHandler;
  fallback?: (e: Error) => void;
  rowActions?: IOption[];
  toggleFilters?: boolean;
  selectionMode?: SelectionMode;
}

export default IListProps;
