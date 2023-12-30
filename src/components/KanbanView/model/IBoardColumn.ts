import IAnything from "../../../model/IAnything";
import IBoardRow from "./IBoardRow";

export interface IBoardColumn<Payload = IAnything> {
    column: string;
    color?: string;
    label: string;
    rows: IBoardRow<Payload>[];
}

export default IBoardColumn;
