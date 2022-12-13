import IAnything from "../../../model/IAnything";
import IOption from "../../../model/IOption";

export interface IActionTrigger<Data extends any = IAnything> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isAvailable?: ((payload: Data) => boolean | Promise<boolean>) | boolean;
}


export default IActionTrigger;
