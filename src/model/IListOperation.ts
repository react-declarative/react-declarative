import IAnything from "./IAnything";
import IRowData from "./IRowData";
import IOption from "./IOption";

/**
 * Represents an operation that can be performed on a list of row data.
 *
 * @template RowData The type of the row data in the list.
 * @template Payload The type of the payload for the operation.
 */
export interface IListOperation<RowData extends IRowData = IAnything, Payload extends IAnything = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    /**
     * Determines if the 'isAvailable' variable is a function or a boolean.
     *
     * @param {Array<RowData>} rowIds - Array of row identifiers.
     * @param {boolean} isAll - Indicates if all rows are considered.
     * @param {Payload} payload - Additional payload data.
     *
     * @returns {boolean | Promise<boolean>} - A boolean value or a promise resolving to a boolean indicating availability.
     */
    isAvailable?: ((rowIds: RowData[], isAll: boolean, payload: Payload) => boolean | Promise<boolean>) | boolean;
}

export default IListOperation;
