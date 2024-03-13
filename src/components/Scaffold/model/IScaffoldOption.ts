import IOption from "../../../model/IOption";

/**
 * Interface representing the options for scaffolding.
 * @template T - The payload type.
 */
export interface IScaffoldOption<T extends any = any> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (payload: T) => Promise<boolean> | boolean;
    isDisabled?: (payload: T) => Promise<boolean> | boolean;
};

export default IScaffoldOption;
