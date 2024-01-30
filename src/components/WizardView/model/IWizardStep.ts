import IAnything from "../../../model/IAnything";

export interface IWizardStep<Payload extends IAnything = IAnything> {
    id?: string;
    isMatch?: (id: string) => boolean;
    isVisible?: (payload: Payload) => boolean;
    label: string;
    icon?: React.ComponentType<any>;
}

export default IWizardStep;
