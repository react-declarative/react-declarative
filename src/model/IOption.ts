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
    icon?: React.ComponentType<any>;
    isVisible?: (payload: Payload) => Promise<boolean> | boolean;
    isDisabled?: (payload: Payload) => Promise<boolean> | boolean;
}

export default IOption;
