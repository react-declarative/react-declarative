import IAnything from "../../../model/IAnything";

/**
 * Represents a row in a board with data and payload.
 *
 * @template Data - The type of data for the row.
 * @template Payload - The type of payload for the row.
 */
export interface IBoardRow<Data = IAnything, Payload = IAnything> {
    label: React.ReactNode;
    value: (id: string, data: Data, payload: Payload) => (React.ReactNode | Promise<React.ReactNode>);
    visible?: boolean | ((id: string, data: Data, payload: Payload) => (boolean | Promise<boolean>));
    click?: (id: string, data: Data, payload: Payload) => (void | Promise<void>);
}

export default IBoardRow;
