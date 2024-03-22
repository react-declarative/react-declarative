import { IColumn } from './IColumn';

/**
 * Represents a TSort object used for sorting data in a specific direction based on a column value.
 *
 * @template T - The type of the column value.
 */
export type TSort<T> = {
  sortDirection: "ASC" | "DESC";
  value: IColumn<T>['field'];
};

export default TSort;
