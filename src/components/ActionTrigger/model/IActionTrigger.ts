import IAnything from "../../../model/IAnything";
import IOption from "../../../model/IOption";

/**
 * Represents an action trigger that determines when an action can be triggered.
 * @template Data - The type of data that the trigger function will receive.
 */
export interface IActionTrigger<Data extends any = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isAvailable?: ((payload: Data) => boolean | Promise<boolean>) | boolean;
}


export default IActionTrigger;
