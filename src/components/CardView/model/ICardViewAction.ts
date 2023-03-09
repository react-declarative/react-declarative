import IOption from "../../../model/IOption";
import IItemData from "./IItemData";

export interface ICardViewAction<ItemData extends IItemData = any, Payload extends any = any> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (row: ItemData, payload: Payload) => Promise<boolean> | boolean;
    isDisabled?: (row: ItemData, payload: Payload) => Promise<boolean> | boolean;
}

export default ICardViewAction;
