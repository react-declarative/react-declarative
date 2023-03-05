import { IActionTrigger } from "../../ActionTrigger";

import IItemData from "./IItemData";

export interface ICardViewOperation<ItemData extends IItemData = any>  extends Omit<IActionTrigger, keyof {
    isAvailable: never;
}> {
    isAvailable: (selectedItems: ItemData[], isAllSelected: boolean) => (boolean | Promise<boolean>);
}

export default ICardViewOperation;
