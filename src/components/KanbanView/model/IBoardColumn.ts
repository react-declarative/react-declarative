import IAnything from "../../../model/IAnything";
import IBoardDivider from "./IBoardDivider";
import IBoardRow from "./IBoardRow";

/**
 * Interface representing a board column.
 *
 * @template Data - Type of data for each row in the column.
 * @template Payload - Type of payload for each row in the column.
 * @template ColumnType - Type of column.
 */
export interface IBoardColumnInternal<Data = IAnything, Payload = IAnything, ColumnType = IAnything> {
    column: ColumnType;
    color?: string;
    label?: string;
    divider?: boolean;
    rows: IBoardRow<Data, Payload>[];
}

export type IBoardColumn<Data = IAnything, Payload = IAnything, ColumnType = IAnything> =
    IBoardColumnInternal<Data, Payload, ColumnType> | IBoardDivider;

export default IBoardColumn;
