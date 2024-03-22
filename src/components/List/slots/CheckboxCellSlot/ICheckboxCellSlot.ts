import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

import { ICheckboxCellProps } from "../../components/SlotFactory/components/CheckboxCell/CheckboxCell";

/**
 * Represents a slot for a checkbox cell in a table.
 *
 * @template RowData - The type of data for the row in the table.
 *
 * @interface
 * @extends ICheckboxCellProps<RowData>
 */
export interface ICheckboxCellSlot<RowData extends IRowData = IAnything> extends ICheckboxCellProps<RowData> { }

export default ICheckboxCellSlot;
