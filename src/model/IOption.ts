import IAnything from "./IAnything";

/**
 * Represents an option for a specific action or behavior.
 *
 * @template Payload - The payload type for evaluating option visibility and disabled state.
 */
export interface IOption<Payload = IAnything> {
    label?: string;
    action?: string;
    divider?: boolean;
    primary?: boolean | number;
    icon?: React.ComponentType<any>;
    /**
     * Checks the visibility of a given payload.
     *
     * @param payload - The payload to check visibility for.
     * @returns - A Promise that resolves to a boolean value indicating the visibility status of the payload, or a boolean value directly indicating the visibility
     * status.
     */
    isVisible?: (payload: Payload) => Promise<boolean> | boolean;
    /**
     * Checks if the provided payload indicates that the element is disabled.
     *
     * @param payload - The payload to check.
     * @returns - A boolean value indicating if the element is disabled.
     */
    isDisabled?: (payload: Payload) => Promise<boolean> | boolean;
}

export default IOption;
