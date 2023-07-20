import React from "react";

export interface IMasterDetailOption<Payload = any> {
    id: string;
    icon?: React.ComponentType<any>;
    label?: string;
    isVisible?: (payload: Payload) => (boolean | Promise<boolean>);
    isDisabled?: (payload: Payload) => (boolean | Promise<boolean>);
    isActive?: (payload: Payload) => (boolean | Promise<boolean>);
}

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
