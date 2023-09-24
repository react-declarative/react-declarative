import createStateProvider from "../../../utils/createStateProvider";

import { RowId } from "../../../model/IRowData";

const [ RowDisabledMapProvider, useRowDisabledMap ] = createStateProvider<Map<RowId, boolean>>();

export { RowDisabledMapProvider, useRowDisabledMap };

export default useRowDisabledMap;
