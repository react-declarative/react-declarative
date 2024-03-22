import IAnything from "../../../model/IAnything";
import IBoardColumn from "./IBoardColumn";

/**
 * Interface representing a board.
 *
 * @template Data - The type of data stored in the board.
 * @template Payload - The type of payload stored in the board.
 * @template ColumnType - The type of column in the board.
 */
export interface IBoard<Data = IAnything, Payload = IAnything, ColumnType = IAnything> {
    id: string;
    label: React.ReactNode;
    columns: IBoardColumn<Data, Payload, ColumnType>[];
}

export default IBoard;
