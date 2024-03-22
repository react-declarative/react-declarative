import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";
import IColumn from "../../../../model/IColumn";

import DisplayMode from "../../../../model/DisplayMode";

/**
 * Represents a column in the body of a table.
 * @template RowData - The type of data in the table rows.
 */
export type BodyColumn<RowData extends IRowData = IAnything> = Omit<IColumn<RowData>, keyof {
    width: never;
}> & {
    width: string;
}

/**
 * Represents a slot for a body row in a table.
 *
 * @template RowData - The type of data associated with the row.
 */
export interface IBodyRowSlot<RowData extends IRowData = IAnything> {
    fullWidth: number;
    row: RowData;
    disabled: boolean;
    columns: BodyColumn<RowData>[];
    mode: DisplayMode;
}

export default IBodyRowSlot;
