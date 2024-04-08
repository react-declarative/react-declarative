import * as React from 'react';

/**
 * Represents a menu option.
 *
 * @template T - The type of the payload for dynamic properties.
 */
export interface IMenuOption<T extends any = any> {
    name?: string;
    label: string;
    /**
     * Represents a variable called 'icon' which is a React component type that can accept any props.
     *
     * @typedef Icon
     */
    icon?: React.ComponentType<any>;
    lifted?: boolean;
    roles?: string[];
    bold?: boolean;
    visible?: boolean;
    disabled?: boolean;
    getRoles?: ((payload: T) => string[]) | ((payload: T) => Promise<string[]>);
    /**
     * Determines whether the payload is in bold format.
     *
     * @typeparam T - The type of the payload.
     * @param payload - The payload to check.
     * @returns - Returns `true` if the payload is in bold format,
     * otherwise returns `false` or a promise that resolves to `true` or `false`.
     */
    isBold?: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>);
    /**
     * Determines if the payload is disabled.
     *
     * @param payload - The payload to check for disablement.
     * @return {boolean | Promise<boolean>} - Returns `true` if the payload is disabled, otherwise `false`.
     *
     * @callback IsDisabledCallback
     * @param payload - The payload to check for disablement.
     * @return {boolean} - Returns `true` if the payload is disabled, otherwise `false`.
     *
     * @callback IsDisabledAsyncCallback
     * @param payload - The payload to check for disablement.
     * @return {Promise<boolean>} - Returns a promise that resolves to `true` if the payload is disabled, otherwise `false`.
     */
    isDisabled?: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>);
    /**
     * Determines the visibility of a payload based on specified conditions.
     *
     * @param isVisible - A function that takes a payload as a parameter and returns a boolean value or a Promise that resolves
     * to a boolean value indicating visibility.
     *
     * @returns - If the isVisible function returns a boolean value, this function will return the evaluated value. If the isVisible function returns a Promise
     *, this function will return a Promise that resolves to a boolean value.
     */
    isVisible?: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>);
}

export interface IMenuGroup<T extends any = any> extends IMenuOption<T> {
    options?: IMenuGroup<T>[];
}

export default IMenuGroup;
