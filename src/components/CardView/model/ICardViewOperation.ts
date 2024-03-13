import { IActionTrigger } from "../../ActionTrigger";

import IItemData from "./IItemData";

/**
 * Interface representing an operation for a card view.
 *
 * @template ItemData - The type of the item data.
 * @template Payload - The type of the payload.
 */
export interface ICardViewOperation<ItemData extends IItemData = any, Payload extends any = any>  extends Omit<IActionTrigger, keyof {
    isAvailable: never;
}> {
    isAvailable?: (selectedItems: ItemData[], isAllSelected: boolean, payload: Payload) => (boolean | Promise<boolean>);
}

export default ICardViewOperation;
