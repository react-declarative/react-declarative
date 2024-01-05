import IAnything from "../../../model/IAnything";
import IBoardColumn from "./IBoardColumn";

export interface IBoard<Data = IAnything, Payload = IAnything> {
    id: string;
    label: React.ReactNode;
    columns: IBoardColumn<Data, Payload>[];
}

export default IBoard;
