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
    isVisible?: (payload: T) => (Promise<boolean> | boolean);
    isDisabled?: (payload: T) => (Promise<boolean> | boolean);
};

export default IBreadcrumbsOption;
