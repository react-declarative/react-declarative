import IAnything from "./IAnything";
import { Value } from "./IField";
import IOption from "./IOption";

export interface IFieldMenu<Data = IAnything, Payload = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (data: Data, payload: Payload) => Promise<boolean> | boolean;
    isDisabled?: (data: Data, payload: Payload) => Promise<boolean> | boolean;
    onClick: (data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;
}

export default IFieldMenu;
