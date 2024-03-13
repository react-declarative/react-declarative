import * as React from 'react';

/**
 * Represents a menu option.
 *
 * @template T - The type of the payload for dynamic properties.
 */
export interface IMenuOption<T extends any = any> {
    name?: string;
    label: string;
    icon?: React.ComponentType<any>;
    lifted?: boolean;
    roles?: string[];
    bold?: boolean;
    visible?: boolean;
    disabled?: boolean;
    getRoles?: ((payload: T) => string[]) | ((payload: T) => Promise<string[]>);
    isBold?: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>);
    isDisabled?: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>);
    isVisible?: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>);
}

export interface IMenuGroup<T extends any = any> extends IMenuOption<T> {
    options?: IMenuGroup<T>[];
}

export default IMenuGroup;
