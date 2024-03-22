import IOption from "./IOption";

/**
 * Represents the options for the Breadcrumbs component.
 *
 * @template T - The type of the payload that can be passed to the isVisible and isDisabled functions.
 */
export interface IBreadcrumbsOption<T extends any = any> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    /**
     * Determines whether the given payload is visible.
     *
     * @param {T} payload - The payload to be checked for visibility.
     * @returns {Promise<boolean> | boolean} - A promise that resolves to a boolean or a direct boolean value indicating the visibility of the payload.
     */
    isVisible?: (payload: T) => (Promise<boolean> | boolean);
    /**
     * Checks if the payload is disabled.
     *
     * @param {T} payload - The payload to check.
     *
     * @returns {Promise<boolean> | boolean} - A promise or a boolean indicating if the payload is disabled.
     */
    isDisabled?: (payload: T) => (Promise<boolean> | boolean);
};

export default IBreadcrumbsOption;
