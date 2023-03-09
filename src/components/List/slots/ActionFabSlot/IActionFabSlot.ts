import React from "react";

import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

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
