import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

export interface IActionAddSlot<RowData extends IRowData = IAnything, Payload extends IAnything = IAnything> {
    action?: string;
    label?: string;
    height: number;
    width: number;
    isVisible?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
    isDisabled?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
}

export default IActionAddSlot;
