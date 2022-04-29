import React from "react";

export interface IOption {
    label: string;
    action: string;
    enabled?: boolean;
    icon?: React.ComponentType<any>;
}

export default IOption;
