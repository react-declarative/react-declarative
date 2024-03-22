import { IActionMenuProps } from "../../../ActionMenu";

import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";
import IColumn from "../../../../model/IColumn";

import DisplayMode from "../../../../model/DisplayMode";

/**
 * Represents a common cell column.
 *
 * @template RowData - The type of the row data for the column.
 */
export type CommonCellColumn<RowData extends IRowData = IAnything> = Omit<IColumn<RowData>, keyof {
    width: never;
}> & {
    width: string;
}

/**
 * Represents a common cell slot.
 *
 * @template RowData - The type of row data used in the cell slot.
 *
 * @property {CommonCellColumn<RowData>} column - The column associated with the cell slot.
 * @property {RowData} row - The row data associated with the cell slot.
 * @property {number} idx - The index of the cell slot.
 * @property {number} fullWidth - The full width of the cell slot.
 * @property {boolean} disabled - Indicates if the cell slot is disabled.
 * @property {DisplayMode} mode - The display mode of the cell slot.
 * @property {IActionMenuProps['onToggle']} onMenuToggle - The function to call when the menu toggle is triggered.
 * @property {IActionMenuProps['onAction']} onAction - The function to call when an action is triggered in the menu.
 */
export interface ICommonCellSlot<RowData extends IRowData = IAnything> {
    column: CommonCellColumn<RowData>;
    row: RowData;
    idx: number;
    fullWidth: number;
    disabled: boolean;
    mode: DisplayMode;
    onMenuToggle: IActionMenuProps['onToggle'];
    onAction: IActionMenuProps['onAction']
}

export default ICommonCellSlot;
