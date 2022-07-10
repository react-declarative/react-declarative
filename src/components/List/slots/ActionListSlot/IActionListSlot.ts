import { IListAction } from "../../../../model/IListProps";
import IAnything from "../../../../model/IAnything";

export interface IActionListSlot<FilterData = IAnything> {
    className?: string;
    style?: React.CSSProperties;
    filterData: FilterData;
    actions: IListAction[];
    height: number;
    width: number;
    title?: string;
}

export default IActionListSlot;
