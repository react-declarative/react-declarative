import React from 'react';

import IScaffold2Option, { IScaffold2OptionInternal } from "./IScaffold2Option";
import Payload from "./Payload";

export interface IScaffold2Group<T = Payload> {
    id: string;
    label?: string;
    icon?: React.ComponentType;
    isVisible?: () => boolean | (Promise<boolean>);
    isDisabled?: () => boolean | (Promise<boolean>);
    children: IScaffold2Option<T>[];
}

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
