import {
  GridColumns,
  GridComponentProps,
  GridSlotsComponent,
  GridSortModel,
  GridSortModelParams,
} from '@material-ui/data-grid';

import IAnything from './IAnything';
import IField from './IField';

export enum ActionType {
  Add = 'add-action',
}

export interface IListAction<FilterData = IAnything> {
  type: ActionType;
  onClick: (e: FilterData) => void;
}

export type IListColumns = {
  // mobileIcon?: React.ComponentType,
} & GridColumns;

interface GridProps {
  onRowClick?: GridComponentProps["onRowClick"];
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

export interface IRowData {
  id: string | number;
}

export type ListHandler<FilterData = IAnything, RowData extends IRowData = IAnything> = (
  data?: FilterData
) => Promise<RowData[]> | RowData[] | void;

export interface IListState<FilterData = IAnything, RowData extends IRowData = IAnything> {
  initComplete: boolean;
  filterData: FilterData;
  isMobile: boolean;
  rows: RowData[];
};

export interface IListCallbacks<FilterData = IAnything, RowData extends IRowData = IAnything> {
  handleDefault: ListHandler<FilterData, RowData>;
  handleFilter: (data: FilterData) => void;
};

export interface IListProps<
  FilterData = IAnything,
  RowData extends IRowData = IAnything,
  Field = IField<FilterData>
> extends GridSlotsComponent,
    GridProps,
    ComponentProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  actions?: IListAction<FilterData>[];
  heightRequest?: (height: number) => number;
  widthRequest?: (width: number) => number;
  sortModel?: GridSortModel;
  onSortModelChange?: (params?: GridSortModelParams) => void;
  columns: IListColumns;
  filters?: Field[];
  handler: ListHandler<FilterData, RowData>;
  rowHeight?: number;
}

export default IListProps;
