import IAnything from "./IAnything";
import IRowData from "./IRowData";
import IOption from "./IOption";

export interface IListOperation<RowData extends IRowData = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
    icon: never;
}> {
    isAvailable?: ((rowIds: RowData[], isAll: boolean) => boolean | Promise<boolean>) | boolean;
}

export default IListOperation;
