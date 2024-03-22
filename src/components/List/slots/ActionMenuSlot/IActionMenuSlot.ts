import IAnything from "../../../../model/IAnything";
import { IListActionOption } from "../../../../model/IListProps";

/**
 * Represents an action menu slot.
 *
 * @interface IActionMenuSlot
 */
export interface IActionMenuSlot {
    options?: Partial<IListActionOption>[];
    deps?: IAnything[];
}

export default IActionMenuSlot;
