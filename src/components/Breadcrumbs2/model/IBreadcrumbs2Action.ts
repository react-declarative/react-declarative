import IAnything from "../../../model/IAnything";
import IOption from "../../../model/IOption";

/**
 * Interface for defining actions related to breadcrumbs with optional data payload.
 * @template Data - The type of the data payload.
 */
export interface IBreadcrumbs2Action<Data = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (payload: Data) => (Promise<boolean> | boolean);
    isDisabled?: (payload: Data) => (Promise<boolean> | boolean);
};

export default IBreadcrumbs2Action;
