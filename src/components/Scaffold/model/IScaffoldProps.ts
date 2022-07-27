import IMenuGroup from "../../../model/IMenuGroup";

export interface IScaffoldProps<T extends any = string> {
    children: React.ReactChild;
    className?: string;
    style?: React.CSSProperties;
    title?: string;
    loader?: boolean;
    colored?: boolean;
    selected?: string;
    options?: IMenuGroup[];
    payload?: T;
    throwError?: boolean;
    fallback?: (e: Error) => void;
    roles?: string[] | ((payload: T) => string[]) | ((payload: T) => Promise<string[]>);
    onOptionClick?: (name: string) => void;
}

export default IScaffoldProps;
