import IOption from "./IOption";

import IAnything from "./IAnything";
import IRowData from "./IRowData";

export interface IListOption<RowData extends IRowData = IAnything> extends IOption {
    isVisible?: (row: RowData) => boolean;
    isDisabled?: (row: RowData) => boolean;
    enabled?: boolean;
}

export default IListOption;
