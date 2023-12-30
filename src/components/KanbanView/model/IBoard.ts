import IAnything from "../../../model/IAnything";
import IBoardColumn from "./IBoardColumn";

export interface IBoard<Payload = IAnything> {
    id: string;
    label: string;
    columns: IBoardColumn<Payload>[];
}

export default IBoard;
