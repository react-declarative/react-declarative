import { IActionTrigger } from "../../ActionTrigger";

import IItemData from "./IItemData";

export interface ICardViewOperation<ItemData extends IItemData = any, Payload extends any = any>  extends Omit<IActionTrigger, keyof {
    isAvailable: never;
}> {
    isAvailable: (selectedItems: ItemData[], isAllSelected: boolean, payload: Payload) => (boolean | Promise<boolean>);
}

export default ICardViewOperation;
