import IAnything from "../../../model/IAnything";

/**
 * Represents a wizard step.
 * @template Payload - The type of payload for the step.
 */
export interface IWizardStep<Payload extends IAnything = IAnything> {
    id?: string;
    isMatch?: (id: string) => boolean;
    isVisible?: (payload: Payload) => boolean;
    label: string;
    icon?: React.ComponentType<any>;
}

export default IWizardStep;
