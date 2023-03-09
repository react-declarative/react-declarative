import IAnything from "./IAnything";
import IRowData from "./IRowData";
import IOption from "./IOption";

export interface IListOperation<RowData extends IRowData = IAnything, Payload extends IAnything = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isAvailable?: ((rowIds: RowData[], isAll: boolean, payload: Payload) => boolean | Promise<boolean>) | boolean;
}

export default IListOperation;
