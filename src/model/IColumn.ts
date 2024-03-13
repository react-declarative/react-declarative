import ColumnType from "./ColumnType";

import { IListActionOption, ListHandlerChips, ListHandlerPagination, ListHandlerSortModel } from "./IListProps";
import IAnything from "./IAnything";
import IRowData from "./IRowData";

import { Value } from "./IField";

/**
 * Represents a column in a table.
 *
 * @template FilterData - The type of filter data that can be used with the column.
 * @template RowData - The type of row data used in the table.
 * @template Payload - The type of payload used with the column.
 */
export interface IColumn<
  FilterData extends {} = IAnything,
  RowData extends IRowData = IAnything,
  Payload = IAnything
> {
  type: ColumnType;
  field?: string;
  primary?: boolean;
  secondary?: boolean;
  avatar?: boolean;
  headerName?: string;
  fullName?: string;
  description?: string;
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
  compute?: (row: RowData & { _payload: Payload }, payload: Payload) => Promise<Value> | Value;
  serialize?: (row: RowData & { _payload: Payload }, payload: Payload) => Promise<Value> | Value;
  element?: React.ComponentType<RowData & {
    _payload: Payload;
  }>;
  sortable?: boolean;
}

export default IColumn;
