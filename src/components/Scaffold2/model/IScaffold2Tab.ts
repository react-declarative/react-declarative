import React from "react";

import Payload from "./Payload";

/**
 * Represents a tab in the Scaffold2 component.
 * @template T - The payload type.
 */
export interface IScaffold2Tab<T = Payload> {
    id: string;
    label?: string;
    icon?: React.ComponentType<any>;
    isVisible?: (payload: T) => (Promise<boolean> | boolean);
    isDisabled?: (payload: T) => (Promise<boolean> | boolean);
    isActive?: (payload: T) => (Promise<boolean> | boolean);
}

/**
 * Represents an internal interface for a scaffold tab.
 * @template T - The payload type of the tab.
 */
export interface IScaffold2TabInternal<T = Payload> extends Omit<IScaffold2Tab<T>, keyof {
    isVisible: never;
    isDisabled: never;
    isActive: never;
}> {
    id: string;
    path: string;
    label?: string;
    icon?: React.ComponentType<any>;
    visible: boolean;
    disabled: boolean;
    active: boolean;
}

export default IScaffold2Tab;
