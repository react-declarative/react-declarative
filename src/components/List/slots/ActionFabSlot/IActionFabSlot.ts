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
    isVisible?: (selectedRows: RowData[], payload: Payload) => (Promise<boolean> | boolean);
    isDisabled?: (selectedRows: RowData[], payload: Payload) => (Promise<boolean> | boolean);
}

export default IActionFabSlot;
