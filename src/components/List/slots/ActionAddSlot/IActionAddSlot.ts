import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

/**
 * Interface for adding a slot in an action.
 *
 * @template RowData - The type of data for selected rows.
 * @template Payload - The type of payload data.
 */
export interface IActionAddSlot<RowData extends IRowData = IAnything, Payload extends IAnything = IAnything> {
    action?: string;
    label?: string;
    height: number;
    width: number;
    /**
     * Determines the visibility of an element based on selected rows and payload.
     *
     * @param {RowData[]} selectedRows - Array of selected rows.
     * @param {Payload} payload - Input payload.
     * @returns {Promise<boolean> | boolean} - A Promise that resolves to a boolean indicating the visibility of the element, or a boolean indicating the visibility directly.
     */
    isVisible?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
    /**
     * Checks if the provided rows are disabled based on the given payload.
     *
     * @param {RowData[]} selectedRows - The selected rows to be checked.
     * @param {Payload} payload - The payload used to determine if the rows are disabled.
     * @returns {Promise<boolean> | boolean} - A Promise resolving to a boolean indicating if the rows are disabled.
     */
    isDisabled?: (selectedRows: RowData[], payload: Payload) => Promise<boolean> | boolean;
}

export default IActionAddSlot;
