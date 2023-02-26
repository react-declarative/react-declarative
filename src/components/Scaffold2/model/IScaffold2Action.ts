import IOption from "../../../model/IOption";
import Payload from "./Payload";

export interface IScaffold2Action<T = Payload> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (payload: T) => Promise<boolean> | boolean;
    isDisabled?: (payload: T) => Promise<boolean> | boolean;
};

export default IScaffold2Action;
