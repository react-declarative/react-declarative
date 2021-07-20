import {
  GridColumns,
  GridSlotsComponent,
  GridSortModel,
  GridSortModelParams,
} from '@material-ui/data-grid';

import ActionType from './ActionType';
import SelectionMode from './SelectionMode';

import IAnything from './IAnything';
import IRowData from './IRowData';
import IColumn from './IColumn';
import IOption from './IOption';
import IField from './IField';

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

export type ListHandler<FilterData = IAnything, RowData extends IRowData = IAnything> = RowData[] | ((
  data?: FilterData
) => Promise<RowData[]> | RowData[]);

export interface IListState<FilterData = IAnything, RowData extends IRowData = IAnything> {
  initComplete: boolean;
  filterData: FilterData;
  isMobile: boolean;
  rows: RowData[];
  rowHeight: number;
  uniqueKey: string;
};

export interface IListCallbacks<FilterData = IAnything, RowData extends IRowData = IAnything> {
  handleDefault: ListHandler<FilterData, RowData> | (() => void);
  handleFilter: (data: FilterData) => void;
  ready: () => void;
};

export interface IListProps<
  FilterData extends IAnything = IAnything,
  RowData extends IRowData = IAnything,
  Field extends IField = IField<FilterData>,
> extends GridSlotsComponent, ComponentProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  filterLabel?: string;
  actions?: IListAction[];
  heightRequest?: (height: number) => number;
  widthRequest?: (width: number) => number;
  sortModel?: GridSortModel;
  onSelectedRows?: (rows: RowData[]) => void;
  onSortModelChange?: (params?: GridSortModelParams) => void;
  onFilterChange?: (data: FilterData) => void;
  onColumnMenuAction?: (action: string) => void;
  onRowAction?: (row: RowData, action: string) => void;
  onRowClick?: (row: RowData) => void;
  onAction?: (action: string) => void;
  gridColumns?: GridColumns;
  columns?: IColumn<RowData>[];
  filters?: Field[];
  handler: ListHandler;
  rowActions?: IOption[];
  toggleFilters?: boolean;
  selectionMode?: SelectionMode;
}

export default IListProps;
