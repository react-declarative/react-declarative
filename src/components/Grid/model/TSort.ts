import { IColumn } from './IColumn';

export type TSort<T> = {
  sortDirection: "ASC" | "DESC";
  value: IColumn<T>['field'];
};

export default TSort;
