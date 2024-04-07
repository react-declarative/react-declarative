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
 * @property column - The column associated with the cell slot.
 * @property row - The row data associated with the cell slot.
 * @property idx - The index of the cell slot.
 * @property fullWidth - The full width of the cell slot.
 * @property disabled - Indicates if the cell slot is disabled.
 * @property mode - The display mode of the cell slot.
 * @property onMenuToggle - The function to call when the menu toggle is triggered.
 * @property onAction - The function to call when an action is triggered in the menu.
 */
export interface ICommonCellSlot<RowData extends IRowData = IAnything> {
    column: CommonCellColumn<RowData>;
    row: RowData;
    idx: number;
    fullWidth: number;
    disabled: boolean;
    mode: DisplayMode;
    /**
     * Callback function for the toggle action of a menu.
     *
     * @callback onMenuToggle
     * @param isOpen - Specifies whether the menu is open or closed.
     * @returns
     */
    onMenuToggle: IActionMenuProps['onToggle'];
    /**
     * The callback function for an action triggered in the action menu.
     *
     * @param action - The action triggered in the action menu.
     * @returns
     */
    onAction: IActionMenuProps['onAction']
}

export default ICommonCellSlot;
