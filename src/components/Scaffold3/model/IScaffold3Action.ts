import IOption from "../../../model/IOption";
import Payload from "./Payload";

/**
 * Represents an action for a scaffold.
 *
 * @template T - The type of payload.
 */
export interface IScaffold3Action<T = Payload> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    /**
     * Determines the visibility of an element based on a provided payload.
     *
     * @param payload - The payload used to determine the visibility.
     * @returns - A promise or a boolean value indicating the visibility of the element.
     */
    isVisible?: (payload: T) => Promise<boolean> | boolean;
    /**
     * Indicates whether a certain payload is disabled.
     *
     * @param payload - The payload to check for disabled status.
     * @returns - A Promise or boolean value representing the disabled status.
     */
    isDisabled?: (payload: T) => Promise<boolean> | boolean;
};

export default IScaffold3Action;
