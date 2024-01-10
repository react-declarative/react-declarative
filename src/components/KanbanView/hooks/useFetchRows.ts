import createValueProvider from "../../../utils/createValueProvider";

import IAnything from "../../../model/IAnything";
import IBoardRow from "../model/IBoardRow";
import IBoardRowInternal from "../model/IBoardRowInternal";

interface Fn {
  (id: string, data: IAnything, rows: IBoardRow[]): Promise<
    IBoardRowInternal[]
  >;
  clear(id?: any): void;
  gc(): void;
}

export const [FetchRowsProvider, useFetchRows] = createValueProvider<Fn>();

export default useFetchRows;
