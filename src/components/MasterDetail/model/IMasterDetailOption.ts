import React from "react";

/**
 * Represents a configuration option for a master-detail component.
 * @template Payload - The type of payload that the option functions will receive.
 */
export interface IMasterDetailOption<Payload = any> {
    id: string;
    icon?: React.ComponentType<any>;
    label?: string;
    isVisible?: (payload: Payload) => (boolean | Promise<boolean>);
    isDisabled?: (payload: Payload) => (boolean | Promise<boolean>);
    isActive?: (payload: Payload) => (boolean | Promise<boolean>);
}

/**
 * Represents an internal interface for a master-detail option.
 *
 * @template Payload - The type of payload associated with the option.
 */
export interface IMasterDetailOptionInternal<Payload = any> extends Omit<IMasterDetailOption<Payload>, keyof {
    isVisible: never;
    isDisabled: never;
    isActive: never;
}> {
    visible: boolean;
    disabled: boolean;
    active: boolean;
}

export default IMasterDetailOption;
