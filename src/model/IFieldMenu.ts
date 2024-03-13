import IAnything from "./IAnything";
import { Value } from "./IField";
import IOption from "./IOption";

/**
 * Represents a field menu.
 * @template Data - The type of data for the menu.
 * @template Payload - The type of payload for the menu.
 */
export interface IFieldMenu<Data = IAnything, Payload = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (data: Data, payload: Payload) => Promise<boolean> | boolean;
    isDisabled?: (data: Data, payload: Payload) => Promise<boolean> | boolean;
    onClick?: (data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;
}

export default IFieldMenu;
