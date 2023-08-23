import ColumnType from "./ColumnType";

import { IListActionOption, ListHandlerChips, ListHandlerPagination, ListHandlerSortModel } from "./IListProps";
import IAnything from "./IAnything";
import IRowData from "./IRowData";

import { Value } from "./IField";

export interface IColumn<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload = IAnything
> {
  type: ColumnType;
  field?: string;
  primary?: boolean;
  secondary?: boolean;
  headerName?: string;
  width: string | ((width: number) => string | number);
  minHeight?: string | number;
  phoneOrder?: number;
  phoneHidden?: boolean;
  tabletOrder?: number;
  tabletHidden?: boolean;
  desktopOrder?: number;
  desktopHidden?: boolean;
  columnMenu?: IListActionOption[];
  isVisible?: (params: {
    filterData: FilterData,
    pagination: ListHandlerPagination,
    sortModel: ListHandlerSortModel<RowData>,
    chips: ListHandlerChips<RowData>,
    search: string,
    payload: Payload
  }) => boolean;
  compute?: (row: RowData, payload: Payload) => Promise<Value> | Value;
  element?: React.ComponentType<RowData>;
  sortable?: boolean;
}

export default IColumn;
