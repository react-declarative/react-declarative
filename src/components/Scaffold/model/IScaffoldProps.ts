import IMenuGroup from "../../../model/IMenuGroup";
import IScaffoldOption from "./IScaffoldOption";

export interface IScaffoldProps<T extends any = string> {
    children: React.ReactChild;
    className?: string;
    dense?: boolean;
    style?: React.CSSProperties;
    title?: string;
    loaderLine?: boolean;
    colored?: boolean;
    selected?: string;
    options?: IMenuGroup[];
    actions?: IScaffoldOption<T>[];
    payload?: T;
    throwError?: boolean;
    fallback?: (e: Error) => void;
    BeforeSearch?: React.ComponentType<any>;
    AfterSearch?: React.ComponentType<any>;
    Loader?: React.ComponentType<any>;
    roles?: string[] | ((payload: T) => string[]) | ((payload: T) => Promise<string[]>);
    onOptionClick?: (name: string) => void;
    onAction?: (name: string) => void;
}

export default IScaffoldProps;
