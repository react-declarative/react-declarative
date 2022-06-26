import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

export interface IActionAddSlot<RowData extends IRowData = IAnything> {
    action?: string;
    isVisible?: (selectedRows: RowData[]) => Promise<boolean> | boolean;
    isDisabled?: (selectedRows: RowData[]) => Promise<boolean> | boolean;
}

export default IActionAddSlot;
