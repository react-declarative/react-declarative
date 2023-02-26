import React from "react";

import { SxProps } from "@mui/system";

import IScaffold2Group, { IScaffold2GroupInternal } from "./IScaffold2Group";
import IScaffold2Action from "./IScaffold2Action";
import Payload from "./Payload";

export interface IScaffold2Props<T = Payload> {
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps;
    appName?: string;
    options: IScaffold2Group<T>[];
    actions?: IScaffold2Action<T>[];
    payload?: T;
    activeOption: string;
    BeforeSearch?: React.ComponentType<any>;
    AfterSearch?: React.ComponentType<any>;
    BeforeMenuContent?: React.ComponentType<any>;
    AfterMenuContent?: React.ComponentType<any>;
    Copyright?: React.ComponentType<any>;
    onAction?: (name: string) => void;
    onOptionClick?: (name: string) => void;
    onOptionGroupClick?: (name: string) => void;
    children: React.ReactNode;
}

export interface IScaffold2InternalProps<T = Payload> extends Omit<IScaffold2Props<T>, keyof {
    options: never;
}> {
    options: IScaffold2GroupInternal<T>[];
}

export default IScaffold2Props;
