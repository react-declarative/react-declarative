import IAnything from "../../../model/IAnything";

export interface IBoardItem<Data = IAnything, Payload = IAnything, ColumnType = IAnything> {
    id: string;
    label?: React.ReactNode | ((id: string, data: Data, payload: Payload) => (React.ReactNode | Promise<React.ReactNode>));
    column: ColumnType;
    data: Data;
    updatedAt?: string;
}

export default IBoardItem;
