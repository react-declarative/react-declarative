export interface IWizardStep {
    id?: string;
    isMatch?: (id: string) => boolean;
    label: string;
    icon?: React.ComponentType<any>;
}

export default IWizardStep;
