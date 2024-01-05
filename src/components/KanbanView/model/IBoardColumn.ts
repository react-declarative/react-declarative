import IAnything from "../../../model/IAnything";
import IBoardRow from "./IBoardRow";

export interface IBoardColumn<Data = IAnything, Payload = IAnything> {
    column: string;
    color?: string;
    label: string;
    rows: IBoardRow<Data, Payload>[];
}

export default IBoardColumn;
