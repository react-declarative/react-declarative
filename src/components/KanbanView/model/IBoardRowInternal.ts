import { IBoardRow } from "../../..";
import IAnything from "../../../model/IAnything";

/**
 * Represents an internal representation of a row in a board.
 *
 * @template Data - The type of data associated with the board row.
 * @template Payload - The type of payload associated with the board row.
 */
export interface IBoardRowInternal<Data = IAnything, Payload = IAnything> extends Omit<IBoardRow<Data, Payload>, keyof {
    value: never;
    visible: never;
}> {
    value: React.ReactNode;
    visible: boolean;
}

export default IBoardRowInternal;
