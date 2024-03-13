import IOption from "../../../model/IOption";
import IItemData from "./IItemData";

/**
 * Represents an interface for an action in a card view.
 * This interface extends the Omit<IOption, keyof { isVisible: never; isDisabled: never; }> interface.
 *
 * @template ItemData - The type of data associated with the item.
 * @template Payload - The type of payload.
 */
export interface ICardViewAction<ItemData extends IItemData = any, Payload extends any = any> extends Omit<IOption, keyof {
    isVisible: never;
    isDisabled: never;
}> {
    isVisible?: (row: ItemData, payload: Payload) => Promise<boolean> | boolean;
    isDisabled?: (row: ItemData, payload: Payload) => Promise<boolean> | boolean;
}

export default ICardViewAction;
