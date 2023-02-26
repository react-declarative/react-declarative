import IScaffold2Tab, { IScaffold2TabInternal } from "./IScaffold2Tab";

import Payload from "./Payload";

export interface IScaffold2Option<T = Payload> {
    id: string;
    label?: string;
    icon?: React.ComponentType<any>;
    tabs?: IScaffold2Tab<T>[];
    isVisible?: (payload: T) => boolean | (Promise<boolean>);
    isDisabled?: (payload: T) => boolean | (Promise<boolean>);
}

export interface IScaffold2OptionInternal<T = Payload> extends Omit<IScaffold2Option<T>, keyof {
    isVisible: never;
    isDisabled: never;
    tabs: never;
}> {
    visible: boolean;
    disabled: boolean;
    tabs?: IScaffold2TabInternal<T>[]
}

export default IScaffold2Option;
