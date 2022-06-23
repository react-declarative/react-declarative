import IOption from "./IOption";

import { RowId } from "./IRowData";

export interface IListOperation extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
    icon: never;
}> {
    isAvailable?: ((rowIds: RowId[], isAll: boolean) => boolean | Promise<boolean>) | boolean;
}

export default IListOperation;
