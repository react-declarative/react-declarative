import IOption from "./IOption";

import IAnything from "./IAnything";
import IRowData from "./IRowData";

/**
 * Represents a row action for a list row.
 *
 * @template RowData - The type of data for the row.
 * @template Payload - The type of payload for the action.
 */
export interface IListRowAction<RowData extends IRowData = IAnything, Payload extends IAnything = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (row: RowData, payload: Payload) => Promise<boolean> | boolean;
    isDisabled?: (row: RowData, payload: Payload) => Promise<boolean> | boolean;
    enabled?: boolean;
}

export default IListRowAction;
