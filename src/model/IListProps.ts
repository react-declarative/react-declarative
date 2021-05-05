import { GridColumns } from '@material-ui/data-grid';

import IAnything from './IAnything';
import IField from './IField';

export enum ActionType {
  Add = 'add-action',
}

export interface IListAction<FilterData = IAnything> {
  type: ActionType;
  onClick: (e: FilterData) => void;
}

export interface IListProps<FilterData = IAnything, RowData = object, Field = IField<FilterData>> {
  className?: string;
  style?: React.CSSProperties;
  actions?: IListAction<FilterData>[];
  heightRequest?: (height: number) => number;
  widthRequest?: (width: number) => number;
  columns: GridColumns;
  filters: Field[];
  handler: (data: FilterData) => Promise<RowData[]> | RowData[];
}

export default IListProps;
