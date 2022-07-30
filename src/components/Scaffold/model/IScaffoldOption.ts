import IOption from "../../../model/IOption";

export interface IScaffoldOption<T extends any = string> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (payload: T) => Promise<boolean> | boolean;
    isDisabled?: (payload: T) => Promise<boolean> | boolean;
};

export default IScaffoldOption;
