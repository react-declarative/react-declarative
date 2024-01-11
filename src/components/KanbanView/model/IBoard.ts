import IAnything from "../../../model/IAnything";
import IBoardColumn from "./IBoardColumn";

export interface IBoard<Data = IAnything, Payload = IAnything, ColumnType = string> {
    id: string;
    label: React.ReactNode;
    columns: IBoardColumn<Data, Payload, ColumnType>[];
}

export default IBoard;
