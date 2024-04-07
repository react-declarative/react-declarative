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
    /**
     * Determines whether the payload is visible or not.
     *
     * @param payload - The payload to check visibility for.
     * @returns - A boolean value indicating the visibility of the payload.
     */
    isVisible?: (payload: T) => Promise<boolean> | boolean;
    /**
     * Determines if a payload is disabled.
     *
     * @param payload - The payload to check for disabling.
     * @returns - A Promise that resolves to a boolean value indicating if the payload is disabled.
     */
    isDisabled?: (payload: T) => Promise<boolean> | boolean;
}

export default ITab;
