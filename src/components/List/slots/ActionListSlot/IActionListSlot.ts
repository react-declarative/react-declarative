import { IListAction } from "../../../../model/IListProps";
import IAnything from "../../../../model/IAnything";

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
