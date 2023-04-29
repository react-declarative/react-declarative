import IMenuGroup from "../../../model/IMenuGroup";
import IScaffoldOption from "./IScaffoldOption";

export interface IScaffoldProps<T extends any = any> {
    children: React.ReactNode;
    className?: string;
    dense?: boolean;
    withPassthrough?: boolean;
    style?: React.CSSProperties;
    title?: string;
    loadingLine?: boolean;
    loading?: number;
    colored?: boolean;
    selected?: string;
    options?: IMenuGroup[];
    actions?: IScaffoldOption<T>[];
    payload?: T;
    throwError?: boolean;
    fallback?: (e: Error) => void;
    BeforeSearch?: React.ComponentType<any>;
    AfterSearch?: React.ComponentType<any>;
    BeforeMenuContent?: React.ComponentType<any>;
    AfterMenuContent?: React.ComponentType<any>;
    Loader?: React.ComponentType<any>;
    roles?: string[] | ((payload: T) => string[]) | ((payload: T) => Promise<string[]>);
    onOptionClick?: (name: string) => void;
    onAction?: (name: string) => void;
    onInit?: () => (void | Promise<void>)
}

export default IScaffoldProps;
