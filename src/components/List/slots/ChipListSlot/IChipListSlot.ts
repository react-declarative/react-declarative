import IAnything from "../../../../model/IAnything";
import IListProps from "../../../../model/IListProps";
import IRowData from "../../../../model/IRowData";

/**
 * Represents a slot in a chip list.
 * @template RowData - The type of data in the chip list row.
 */
export interface IChipListSlot<RowData extends IRowData = IAnything> {
    /**
     * Represents a list of chips in a row data object.
     *
     * @typedef {Array<Chip>} ListChips
     */
    listChips: IListProps<RowData>['chips'];
    loading: boolean;
}

export default IChipListSlot;
