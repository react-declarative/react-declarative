import {
  Ref,
} from 'react';

import {
  GridColumns,
  GridSortModel,
} from '@mui/x-data-grid';

import ActionType from './ActionType';
import DisplayMode from './DisplayMode';
import SelectionMode from './SelectionMode';

import IAnything from './IAnything';
import IRowData from './IRowData';
import IColumn from './IColumn';
import IOption from './IOption';
import IField from './IField';
import IListApi from './IListApi';

interface IUpdateOption extends IOption {
  action: 'update-now';
  label: never;
  icon: never;
};

interface IAutoReloadOption extends IOption {
  action: 'auto-reload';
  label: never;
  icon: never;
};

interface IMobileViewOption extends IOption {
  action: 'mobile-view';
  label: never;
  icon: never;
};

export interface IListAction extends Partial<IOption> {
  type: ActionType;
  options?: Partial<IOption | IUpdateOption | IAutoReloadOption | IMobileViewOption>[];
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

interface SlotsComponent {
  Header?: any;
  ColumnMenu?: any;
  ErrorOverlay?: any;
  Footer?: any;
  Toolbar?: any;
  CheckBox?: any;
  PreferencesPanel?: any;
  LoadingOverlay?: any;
  NoResultsOverlay?: any;
  NoRowsOverlay?: any;
  Pagination?: any;
  FilterPanel?: any;
  ColumnsPanel?: any;
  Panel?: any;
}

export type ListHandlerResult<RowData extends IRowData = IAnything> = RowData[] | {
  rows: RowData[];
  total: number;
};

export type ListAvatar = {
  src?: string;
  alt?: string;
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
  autoReload: boolean;
  filtersCollapsed: boolean;
  sort: ListHandlerSortModel;
};

export interface IListCallbacks<FilterData = IAnything, RowData extends IRowData = IAnything> {
  handleDefault: ListHandler<FilterData, RowData> | (() => void);
  handleSortModel: (sort: ListHandlerSortModel) => void;
  handleFilter: (data: FilterData) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  handleFiltersCollapsed: (filtersCollapsed: boolean) => void;
  handleAutoReload: (autoReload: boolean) => void;
  handleSetMobile: (isMobile: boolean) => void;
  handleReload: () => void;
  ready: () => void;
};

export interface IListSortItem {
  field: string;
  sort: 'asc' | 'desc';
}

export interface IListProps<
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  Field extends IField = IField<FilterData>,
  > extends SlotsComponent, ComponentProps {
  ref?: Ref<IListApi>;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  filterLabel?: string;
  actions?: IListAction[];
  limit?: number;
  sizeByParent?: boolean;
  autoReload?: boolean;
  autoReloadInterval?: number;
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
  rowMark?: ((row: RowData) => string) | ((row: RowData) => Promise<string>) | string;
  rowAvatar?: string | ((row: RowData) => ListAvatar) | ((row: RowData) => Promise<ListAvatar>) | ((row: RowData) => string) | ListAvatar;
  fallback?: (e: Error) => void;
  rowActions?: IOption[];
  toggleFilters?: boolean;
  selectionMode?: SelectionMode;
  displayMode?: DisplayMode;
}

export default IListProps;
