import IOption from "../../../model/IOption";
import IItemData from "./IItemData";

export interface ICardViewAction<ItemData extends IItemData = any> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (row: ItemData) => Promise<boolean> | boolean;
    isDisabled?: (row: ItemData) => Promise<boolean> | boolean;
}

export default ICardViewAction;
