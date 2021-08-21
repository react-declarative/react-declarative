import * as React from 'react';

export interface IMenuOption {
    name?: string;
    label: string;
    icon?: React.ComponentType;
    bold?: boolean;
    roles?: string[];
    disabled?: boolean;
}

export interface IMenuGroup extends IMenuOption {
    options?: IMenuGroup[];
}

export default IMenuGroup;
