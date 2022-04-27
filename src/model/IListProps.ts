import {
  Ref,
} from 'react';

import ActionType from './ActionType';
import DisplayMode from './DisplayMode';
import SelectionMode from './SelectionMode';

import IAnything from './IAnything';
import IRowData, { RowId } from './IRowData';
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

export interface IListChip<RowData extends IRowData = IAnything> {
  name: keyof RowData,
  label: string;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  enabled?: boolean;
}

interface ComponentProps {
  /*columnMenuProps?: any;
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
  panelProps?: any;*/
}

interface SlotsComponent {
  /*Header?: any;
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
  Panel?: any;*/
}

export type ListHandlerResult<RowData extends IRowData = IAnything> = RowData[] | {
  rows: RowData[];
  total: number | null;
};

export type ListAvatar = {
  src?: string;
  alt?: string;
};

export type ListHandlerPagination = {
  limit: number;
  offset: number;
};

export type ListHandlerChips<RowData extends IRowData = IAnything> = Record<keyof RowData, boolean>;

export type ListHandlerSortModel<RowData extends IRowData = IAnything> = IListSortItem<RowData>[];

export type ListHandler<FilterData = IAnything, RowData extends IRowData = IAnything> = RowData[] | ((
  data: FilterData,
  pagination: ListHandlerPagination,
  sort: ListHandlerSortModel<RowData>,
  chips: ListHandlerChips<RowData>,
) => Promise<ListHandlerResult<RowData>> | ListHandlerResult<RowData>);

export interface IListState<FilterData = IAnything, RowData extends IRowData = IAnything> {
  initComplete: boolean;
  filterData: FilterData;
  isMobile: boolean;
  rows: RowData[];
  limit: number;
  offset: number;
  total: number | null;
  loading: boolean;
  autoReload: boolean;
  filtersCollapsed: boolean;
  sort: ListHandlerSortModel<RowData>;
  chips: ListHandlerChips<RowData>;
};

export interface IListCallbacks<FilterData = IAnything, RowData extends IRowData = IAnything> {
  handleDefault: ListHandler<FilterData, RowData> | (() => void);
  handleSortModel: (sort: ListHandlerSortModel<RowData>) => void;
  handleFilter: (data: FilterData) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  handleFiltersCollapsed: (filtersCollapsed: boolean) => void;
  handleAutoReload: (autoReload: boolean) => void;
  handleSetMobile: (isMobile: boolean) => void;
  handleChips: (chips: ListHandlerChips) => void;
  handleReload: () => void;
  ready: () => void;
};

export interface IListSortItem<RowData extends IRowData = IAnything> {
  field: keyof RowData;
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
  keepFlow?: boolean;
  autoReloadInterval?: number;
  selectedRows?: RowId[];
  heightRequest?: (height: number) => number;
  widthRequest?: (width: number) => number;
  onSelectedRows?: (rowIds: RowId[], initialChange: boolean) => void;
  onFilterChange?: (data: FilterData) => void;
  onChipsChange?: (chips: ListHandlerChips<RowData>) => void;
  onSortModelChange?: (sort: ListHandlerSortModel<RowData>) => void;
  /*onColumnMenuAction?: (action: string) => void;*/
  onRowAction?: (row: RowData, action: string) => void;
  onRowClick?: (row: RowData) => void;
  onAction?: (action: string) => void;
  columns: IColumn<RowData>[];
  filters?: Field[];
  handler: ListHandler;
  rowMark?: ((row: RowData) => string) | ((row: RowData) => Promise<string>) | string;
  rowAvatar?: string | ((row: RowData) => ListAvatar) | ((row: RowData) => Promise<ListAvatar>) | ((row: RowData) => string) | ListAvatar;
  fallback?: (e: Error) => void;
  rowActions?: IOption[];
  toggleFilters?: boolean;
  selectionMode?: SelectionMode;
  chips?: IListChip<RowData>[];
  sortModel?: ListHandlerSortModel<RowData>;
  displayMode?: DisplayMode;
  ExpansionContent?: React.ComponentType;
}

export default IListProps;
