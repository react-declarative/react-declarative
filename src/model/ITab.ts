import IOption from "./IOption";

/**
 * Interface representing a tab.
 * @template T - The type of the payload.
 */
export interface ITab<T extends any = any> extends Omit<IOption, keyof {
    action: never;
    isVisible: never;
    isDisabled: never;
}> {
    value: string;
    isVisible?: (payload: T) => Promise<boolean> | boolean;
    isDisabled?: (payload: T) => Promise<boolean> | boolean;
}

export default ITab;
