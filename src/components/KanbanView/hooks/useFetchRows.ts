import createValueProvider from "../../../utils/createValueProvider";

import IAnything from "../../../model/IAnything";
import IBoardRow from "../model/IBoardRow";
import IBoardRowInternal from "../model/IBoardRowInternal";

/**
 * Represents a functional interface for handling board manipulation.
 *
 * @callback Fn
 * @param id - The ID of the board.
 * @param data - The data to be processed.
 * @param rows - The array of board rows.
 * @returns - A Promise that resolves to an array of internal board rows.
 */
interface Fn {
  (id: string, data: IAnything, rows: IBoardRow[]): Promise<
    IBoardRowInternal[]
  >;
  clear(id?: any): void;
  gc(): void;
}

export const [FetchRowsProvider, useFetchRows] = createValueProvider<Fn>();

export default useFetchRows;
