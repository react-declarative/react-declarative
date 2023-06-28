import * as React from "react";

import { SxProps } from "@mui/system";

import IScaffold2Group, { IScaffold2GroupInternal } from "./IScaffold2Group";
import IScaffold2Action from "./IScaffold2Action";
import Payload from "./Payload";

export interface IScaffold2Props<T = Payload> {
    noAppName?: boolean;
    fixedHeader?: boolean;
    noSearch?: boolean;
    dense?: boolean;
    className?: string;
    style?: React.CSSProperties;
    sx?: SxProps;
    appName?: string;
    options: IScaffold2Group<T>[];
    actions?: IScaffold2Action<T>[];
    loading?: boolean | number;
    payload?: T;
    deps?: any[];
    activeOptionPath: string;
    activeTabPath?: string;
    BeforeSearch?: React.ComponentType<any>;
    AfterSearch?: React.ComponentType<any>;
    BeforeMenuContent?: React.ComponentType<any>;
    AfterMenuContent?: React.ComponentType<any>;
    Copyright?: React.ComponentType<any>;
    Loader?: React.ComponentType<any>;
    onAction?: (name: string) => void;
    onOptionClick?: (path: string, id: string) => void;
    onOptionGroupClick?: (path: string, id: string) => void;
    onTabChange?: (path: string, tab: string, id: string) => void;
    children: React.ReactNode;
    onInit?: () => (void | Promise<void>);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
    throwError?: boolean;
}

export interface IScaffold2InternalProps<T = Payload> extends Omit<IScaffold2Props<T>, keyof {
    options: never;
}> {
    options: IScaffold2GroupInternal<T>[];
}

export default IScaffold2Props;
