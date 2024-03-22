import IAnything from "../../../model/IAnything";
import IBoardRow from "./IBoardRow";

/**
 * Interface representing a board column.
 *
 * @template Data - Type of data for each row in the column.
 * @template Payload - Type of payload for each row in the column.
 * @template ColumnType - Type of column.
 */
export interface IBoardColumn<Data = IAnything, Payload = IAnything, ColumnType = IAnything> {
    column: ColumnType;
    color?: string;
    label?: string;
    rows: IBoardRow<Data, Payload>[];
}

export default IBoardColumn;
