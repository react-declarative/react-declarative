import IOption from "./IOption";

import IAnything from "./IAnything";
import IRowData from "./IRowData";

export interface IListRowAction<RowData extends IRowData = IAnything, Payload extends IAnything = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (row: RowData, payload: Payload) => Promise<boolean> | boolean;
    isDisabled?: (row: RowData, payload: Payload) => Promise<boolean> | boolean;
    enabled?: boolean;
}

export default IListRowAction;
