import React from "react";

import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

/**
 * Represents an action slot for a FAB (Floating Action Button).
 *
 * @template RowData - The type of data for the selected rows.
 * @template Payload - The type of data for the action payload.
 */
export interface IActionFabSlot<RowData extends IRowData = IAnything, Payload extends IAnything = IAnything> {
    action?: string;
    label?: string;
    icon?: React.ComponentType<any>;
    height: number;
    width: number;
    /**
     * Determines if the element is visible based on the selected rows and payload.
     *
     * @param {RowData[]} selectedRows - The selected rows to check against.
     * @param {Payload} payload - The payload to evaluate.
     * @returns {Promise<boolean> | boolean} - True if the element is visible, false otherwise.
     */
    isVisible?: (selectedRows: RowData[], payload: Payload) => (Promise<boolean> | boolean);
    /**
     * Determines whether a specific feature is disabled based on the selected rows and payload.
     *
     * @param {RowData[]} selectedRows - The selected rows.
     * @param {Payload} payload - The payload.
     * @returns {Promise<boolean> | boolean} - A promise that resolves to a boolean or a boolean value.
     */
    isDisabled?: (selectedRows: RowData[], payload: Payload) => (Promise<boolean> | boolean);
}

export default IActionFabSlot;
