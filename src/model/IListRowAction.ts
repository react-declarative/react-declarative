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
    /**
     * Determines the visibility of a row based on the provided row data and payload.
     *
     * @param row - The data for the row being evaluated.
     * @param payload - Additional information or data that can be used to determine the row's visibility.
     *
     * @returns - A boolean value indicating whether the row should be visible or not.
     *
     * @async
     */
    isVisible?: (row: RowData, payload: Payload) => Promise<boolean> | boolean;
    /**
     * Checks if a row is disabled based on the row data and payload.
     *
     * @param row - The row data to check.
     * @param payload - The payload to use for checking.
     * @returns - A Promise or boolean indicating if the row is disabled.
     */
    isDisabled?: (row: RowData, payload: Payload) => Promise<boolean> | boolean;
    enabled?: boolean;
}

export default IListRowAction;
