import React from 'react';

import IScaffold2Option, { IScaffold2OptionInternal } from "./IScaffold2Option";
import Payload from "./Payload";

/**
 * Interface representing a group in IScaffold2.
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
export interface IScaffold2Group<T = Payload> {
    id: string;
    label?: string;
    icon?: React.ComponentType;
    noHeader?: boolean;
    isVisible?: () => boolean | (Promise<boolean>);
    isDisabled?: () => boolean | (Promise<boolean>);
    children: IScaffold2Option<T>[];
}

/**
 * Represents an internal group in the IScaffold2 component.
 *
 * @template T - The type of payload data.
 * @interface IScaffold2GroupInternal
 */
export interface IScaffold2GroupInternal<T = Payload> extends Omit<IScaffold2Group<T>, keyof {
    isVisible: never;
    isDisabled: never;
    children: never;
}> {
    path: string;
    visible: boolean;
    disabled: boolean;
    children: IScaffold2OptionInternal<T>[];
}

export default IScaffold2Group;
