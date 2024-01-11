import IAnything from "../../../model/IAnything";
import IBoardRow from "./IBoardRow";

export interface IBoardColumn<Data = IAnything, Payload = IAnything, ColumnType = string> {
    column: ColumnType;
    color?: string;
    label?: string;
    rows: IBoardRow<Data, Payload>[];
}

export default IBoardColumn;
