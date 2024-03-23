import IAnything from "../../../../model/IAnything";
import { IListActionOption } from "../../../../model/IListProps";

/**
 * Represents an action menu slot.
 *
 * @interface IActionMenuSlot
 */
export interface IActionMenuSlot {
    /**
     * Represents a set of options for a list action.
     * These options are stored in an array of partial objects of type IListActionOption.
     *
     * @typedef {Partial<IListActionOption>[]} ListActionOptions
     */
    options?: Partial<IListActionOption>[];
    deps?: IAnything[];
}

export default IActionMenuSlot;
