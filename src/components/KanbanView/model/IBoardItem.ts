import IAnything from "../../../model/IAnything";

/**
 * Interface representing a board item.
 *
 * @template Data - The type of data for the board item.
 * @template Payload - The type of payload for the board item.
 * @template ColumnType - The type of column for the board item.
 */
export interface IBoardItem<Data = IAnything, Payload = IAnything, ColumnType = IAnything> {
    id: string;
    label?: React.ReactNode | ((id: string, data: Data, payload: Payload) => (React.ReactNode | Promise<React.ReactNode>));
    column: ColumnType;
    data: Data;
    updatedAt?: string;
}

export default IBoardItem;
