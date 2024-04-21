import React from 'react';

import IScaffold3Option, { IScaffold3OptionInternal } from "./IScaffold3Option";
import Payload from "./Payload";

/**
 * Interface representing a group in IScaffold3.
 *
 * @template T - The type of payload for the options in the group.
 *
 * @property id - The unique identifier of the group.
 * @property [label] - The label to be displayed for the group.
 * @property [icon] - The icon to be displayed for the group.
 * @property [noHeader] - Flag indicating whether to display the header for the group.
 * @property [isVisible] - Function or Promise that returns a boolean indicating whether the group is visible.
 * @property [isDisabled] - Function or Promise that returns a boolean indicating whether the group is disabled.
 * @property children - The options belonging to the group.
 */
export interface IScaffold3Group<T = Payload> {
    id: string;
    label?: string;
    icon?: React.ComponentType;
    noHeader?: boolean;
    /**
     * Checks if the element is visible.
     *
     * @returns - True if the element is visible.
     */
    isVisible?: () => boolean | (Promise<boolean>);
    /**
     * Checks if the element is disabled.
     *
     * @returns - Returns a boolean value or a promise that resolves to a boolean value.
     */
    isDisabled?: () => boolean | (Promise<boolean>);
    children: IScaffold3Option<T>[];
}

/**
 * Represents an internal group in the IScaffold3 component.
 *
 * @template T - The type of payload data.
 * @interface IScaffold3GroupInternal
 */
export interface IScaffold3GroupInternal<T = Payload> extends Omit<IScaffold3Group<T>, keyof {
    isVisible: never;
    isDisabled: never;
    children: never;
}> {
    path: string;
    visible: boolean;
    disabled: boolean;
    /**
     * Represents a collection of internal options for a Scaffold3 component.
     *
     * @template T - The type of the options.
     */
    children: IScaffold3OptionInternal<T>[];
}

export default IScaffold3Group;
