import * as React from 'react';

export interface IMenuOption<T extends any = string> {
    name?: string;
    label: string;
    icon?: React.ComponentType<any>;
    roles?: string[];
    bold?: boolean;
    visible?: boolean;
    disabled?: boolean;
    getRoles?: ((payload: T) => string[]) | ((payload: T) => Promise<string[]>);
    isBold?: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>);
    isDisabled?: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>);
    isVisible?: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>);
}

export interface IMenuGroup<T extends any = string> extends IMenuOption<T> {
    options?: IMenuGroup<T>[];
}

export default IMenuGroup;
