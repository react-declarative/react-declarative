import IAnything from "../../../model/IAnything";

/**
 * Represents a step in a tabs component.
 *
 * @template Payload - The type of payload for the step.
 */
export interface ITabsStep<Payload extends IAnything = IAnything> {
    id?: string;
    isMatch?: (id: string) => boolean;
    isVisible?: (payload: Payload) => boolean;
    label?: string;
    passthrough?: boolean;
    icon?: React.ComponentType<any>;
}

export default ITabsStep;
