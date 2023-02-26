import React from "react";

import Payload from "./Payload";

export interface IScaffold2Tab<T = Payload> {
    id: string;
    label?: string;
    icon?: React.ComponentType<any>;
    isVisible?: (payload: T) => Promise<boolean> | boolean;
    isDisabled?: (payload: T) => Promise<boolean> | boolean;
}

export interface IScaffold2TabInternal<T = Payload> extends Omit<IScaffold2Tab<T>, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    id: string;
    label?: string;
    icon?: React.ComponentType<any>;
    visible: boolean;
    disabled: boolean;
}

export default IScaffold2Tab;
