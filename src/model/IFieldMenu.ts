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
    /**
     * Determines the visibility of an element based on the given data and payload.
     *
     * @param data - The data used for determining visibility.
     * @param payload - Additional payload used for determining visibility.
     * @returns - A Promise resolving to a boolean value or a boolean value indicating the visibility of the element.
     */
    isVisible?: (data: Data, payload: Payload) => Promise<boolean> | boolean;
    /**
     * Checks whether the given data and payload indicate that the feature is disabled.
     *
     * @param data - The data used to determine if the feature is disabled.
     * @param payload - The payload used to determine if the feature is disabled.
     * @returns - Returns a Promise resolving to a boolean indicating whether the feature is disabled. If a Promise is returned, it resolves to `true` if the
     * feature is disabled, otherwise it resolves to `false`. If a boolean is returned directly, it indicates whether the feature is disabled.
     */
    isDisabled?: (data: Data, payload: Payload) => Promise<boolean> | boolean;
    /**
     * Represents a callback function that is triggered on click event.
     * @callback onClick
     * @param data - The data object associated with the click event.
     * @param payload - The payload object associated with the click event.
     * @param onValueChange - A callback function that is called when the value of `data` is changed.
     *                                  It is passed the new value as a parameter.
     * @param onChange - A callback function that is called when any change occurs in `data`.
     *                             It is passed the updated `data` object as a parameter.
     * @returns
     */
    onClick?: (data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void;
}

export default IFieldMenu;
