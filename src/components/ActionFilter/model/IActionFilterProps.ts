import React from "react";

import IActionFilter from "./IActionFilter";

export interface IActionFilterProps {
    actions: IActionFilter[];
    label?: React.ReactNode;
    addLabel?: React.ReactNode;
    data?: Record<string, string>;
    onChange?: (data: Record<string, string>) => void;
}

export default IActionFilterProps;
