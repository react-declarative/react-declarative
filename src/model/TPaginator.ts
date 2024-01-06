import {
  ListHandlerChips,
  ListHandlerPagination,
  ListHandlerSortModel,
} from "./IListProps";
import IRowData from "./IRowData";

export type TPaginator<
  FilterData extends {} = any,
  RowData extends IRowData = any,
  Payload = any
> = (
  data: FilterData,
  pagination: ListHandlerPagination,
  sort: ListHandlerSortModel<RowData>,
  chips: ListHandlerChips<RowData>,
  search: string,
  payload: Payload
) => Promise<
  | {
      rows: RowData[];
      total: number | null;
    }
  | RowData[]
>;

export default TPaginator;
