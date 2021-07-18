import React from "react";

export interface IOption {
    label: string;
    action: string;
    icon?: React.ComponentType<any>;
}

export default IOption;
