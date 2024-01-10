import createValueProvider from "../../../utils/createValueProvider";

import IAnything from "../../../model/IAnything";
import IBoardRow from "../model/IBoardRow";
import IBoardRowInternal from "../model/IBoardRowInternal";

type Fn = (
  id: string,
  data: IAnything,
  rows: IBoardRow[]
) => Promise<IBoardRowInternal[]>;

export const [FetchRowsProvider, useFetchRows] = createValueProvider<Fn>();

export default useFetchRows;
