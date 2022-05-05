import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

import DisplayMode from "../../../../model/DisplayMode";

export interface IBodyRowSlot<RowData extends IRowData = IAnything> {
    fullWidth: number;
    row: RowData;
    mode: DisplayMode;
}

export default IBodyRowSlot;
