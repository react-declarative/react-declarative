import IAnything from "./IAnything";

export interface IOption<Payload = IAnything> {
    label?: string;
    action?: string;
    divider?: boolean;
    icon?: React.ComponentType<any>;
    isVisible?: (payload: Payload) => Promise<boolean> | boolean;
    isDisabled?: (payload: Payload) => Promise<boolean> | boolean;
}

export default IOption;
