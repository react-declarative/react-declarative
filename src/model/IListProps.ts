import { GridColumns, GridComponentProps, GridSlotsComponent } from '@material-ui/data-grid';

import IAnything from './IAnything';
import IField from './IField';

export enum ActionType {
  Add = 'add-action',
}

export interface IListAction<FilterData = IAnything> {
  type: ActionType;
  onClick: (e: FilterData) => void;
}

export type IListColumns = GridColumns;

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

export interface IListProps<FilterData = IAnything, RowData = IAnything, Field = IField<FilterData>> extends GridSlotsComponent, GridProps, ComponentProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  actions?: IListAction<FilterData>[];
  heightRequest?: (height: number) => number;
  widthRequest?: (width: number) => number;
  columns: IListColumns;
  filters: Field[];
  handler: (data: FilterData) => Promise<RowData[]> | RowData[];
}

export default IListProps;
