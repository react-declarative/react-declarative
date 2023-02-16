import Dimension from './Dimension';
import RowData from './RowData';

export interface IColumn<T = RowData> {
  field?: keyof T;
  label: string;
  align?: 'center' | 'left' | 'right' | 'stretch';
  format?: (row: T) => React.ReactElement | string;
  minWidth?: number;
  width?: Dimension | ((containerWidth: number) => Dimension);
}

export default IColumn;
