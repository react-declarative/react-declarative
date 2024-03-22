import { IListAction } from "../../../../model/IListProps";
import IAnything from "../../../../model/IAnything";

/**
 * Represents a slot in an action list.
 *
 * @template FilterData - The type of filter data for this slot.
 */
export interface IActionListSlot<FilterData extends {} = IAnything> {
    className?: string;
    style?: React.CSSProperties;
    filterData: FilterData;
    actions: IListAction[];
    deps?: any[];
    height: number;
    width: number;
    title?: string;
}

export default IActionListSlot;
