import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";
import IColumn from "../../../../model/IColumn";

import DisplayMode from "../../../../model/DisplayMode";

export type BodyColumn<RowData extends IRowData = IAnything> = Omit<IColumn<RowData>, keyof {
    width: never;
}> & {
    width: string;
}

export interface IBodyRowSlot<RowData extends IRowData = IAnything> {
    fullWidth: number;
    row: RowData;
    columns: BodyColumn<RowData>[];
    mode: DisplayMode;
}

export default IBodyRowSlot;
