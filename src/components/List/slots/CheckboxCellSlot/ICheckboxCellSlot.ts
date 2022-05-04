import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

import { ICheckboxCellProps } from "../../components/SlotFactory/components/CheckboxCell/CheckboxCell";

export interface ICheckboxCellSlot<RowData extends IRowData = IAnything> extends ICheckboxCellProps<RowData> { }

export default ICheckboxCellSlot;
