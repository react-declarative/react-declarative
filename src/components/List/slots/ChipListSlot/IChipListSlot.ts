import IAnything from "../../../../model/IAnything";
import IListProps from "../../../../model/IListProps";
import IRowData from "../../../../model/IRowData";

export interface IChipListSlot<RowData extends IRowData = IAnything> {
    listChips: IListProps<RowData>['chips'];
    loading: boolean;
}

export default IChipListSlot;
