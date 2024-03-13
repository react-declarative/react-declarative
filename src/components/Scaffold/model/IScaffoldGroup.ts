import { IMenuOption } from "../../../model/IMenuGroup";

/**
 * Represents an option for scaffold.
 * @template T - The type of the option value.
 */
export interface IScaffoldOption<T extends any = any> extends Omit<IMenuOption<T>, keyof {
    disabled: never;
    visible: never;
    roles: never;
    bold: never;
    isBold: never;
    isVisible: never;
    isDisabled: never;
}> {
    disabled?: boolean;
    visible?: boolean;
    roles?: string[];
    bold?: boolean;
}

/**
 * Represents a scaffold group.
 * @template T The type of data associated with the scaffold group.
 */
export interface IScaffoldGroup<T extends any = any> extends IScaffoldOption<T> {
    options?: IScaffoldGroup<T>[];
}

export default IScaffoldGroup;
