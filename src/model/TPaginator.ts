import {
  ListHandlerChips,
  ListHandlerPagination,
  ListHandlerSortModel,
} from "./IListProps";
import IRowData from "./IRowData";

/**
 * Type definition for TPaginator.
 *
 * @template FilterData - The type of data used for filtering.
 * @template RowData - The type of data representing a row.
 * @template Payload - The type of additional payload data.
 *
 * @param data - The filter data.
 * @param pagination - The pagination settings.
 * @param sort - The sorting settings.
 * @param chips - The chip filters.
 * @param search - The search string.
 * @param payload - The additional payload data.
 *
 * @returns A promise that resolves to either an array of row data or an object containing rows and total count.
 */
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
