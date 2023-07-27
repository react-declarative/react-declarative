import { SxProps } from "@mui/system";

import IScaffold2Tab, { IScaffold2TabInternal } from "./IScaffold2Tab";

import Payload from "./Payload";

export interface IScaffold2Option<T = Payload> {
    id: string;
    label?: string;
    lifted?: boolean;
    pin?: boolean;
    sx?: SxProps;
    icon?: React.ComponentType<any>;
    tabs?: IScaffold2Tab<T>[];
    options?: IScaffold2Option<T>[];
    isVisible?: (payload: T) => boolean | (Promise<boolean>);
    isDisabled?: (payload: T) => boolean | (Promise<boolean>);
}

export interface IScaffold2OptionInternal<T = Payload> extends Omit<IScaffold2Option<T>, keyof {
    isVisible: never;
    isDisabled: never;
    options: never;
    tabs: never;
}> {
    path: string;
    visible: boolean;
    disabled: boolean;
    options?: IScaffold2OptionInternal<T>[];
    tabs?: IScaffold2TabInternal<T>[]
}

export default IScaffold2Option;
