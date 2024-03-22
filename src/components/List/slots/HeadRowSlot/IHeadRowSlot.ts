import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";
import IColumn from "../../../../model/IColumn";

import DisplayMode from "../../../../model/DisplayMode";

/**
 * Represents a column in a table's header.
 *
 * @template RowData - The type of data in the rows of the table.
 */
export type HeadColumn<RowData extends IRowData = IAnything> = Omit<IColumn<RowData>, keyof {
    width: never;
}> & {
    width: string;
}

/**
 * Interface for the head row slot of a table component.
 * @template RowData - The type of data for each row.
 */
export interface IHeadRowSlot<RowData extends IRowData = IAnything>  {
    columns: HeadColumn<RowData>[];
    fullWidth: number;
    mode: DisplayMode;
}

export default IHeadRowSlot;
