import IAnything from "../../../../model/IAnything";
import IListProps from "../../../../model/IListProps";
import IRowData from "../../../../model/IRowData";

/**
 * Represents a slot in a chip list.
 * @template RowData - The type of data in the chip list row.
 */
export interface IChipListSlot<RowData extends IRowData = IAnything> {
    listChips: IListProps<RowData>['chips'];
    loading: boolean;
}

export default IChipListSlot;
