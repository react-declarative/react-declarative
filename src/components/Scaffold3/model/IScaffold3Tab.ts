import React from "react";

import Payload from "./Payload";

/**
 * Represents a tab in the Scaffold3 component.
 * @template T - The payload type.
 */
export interface IScaffold3Tab<T = Payload> {
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
export interface IScaffold3TabInternal<T = Payload> extends Omit<IScaffold3Tab<T>, keyof {
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

export default IScaffold3Tab;
