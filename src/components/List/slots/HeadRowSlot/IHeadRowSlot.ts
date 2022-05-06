import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";
import IColumn from "../../../../model/IColumn";

import DisplayMode from "../../../../model/DisplayMode";

export type HeadColumn<RowData extends IRowData = IAnything> = Omit<IColumn<RowData>, keyof {
    width: never;
}> & {
    width: string;
}

export interface IHeadRowSlot<RowData extends IRowData = IAnything>  {
    columns: HeadColumn<RowData>[];
    fullWidth: number;
    mode: DisplayMode;
}

export default IHeadRowSlot;
