export interface IOption {
    label: string;
    action: string;
    icon?: React.ComponentType<any>;
    isVisible?: () => Promise<boolean> | boolean;
    isDisabled?: () => Promise<boolean> | boolean;
}

export default IOption;
