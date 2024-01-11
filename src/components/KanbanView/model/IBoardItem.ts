import IAnything from "../../../model/IAnything";

export interface IBoardItem<Data = IAnything, ColumnType = IAnything> {
    id: string;
    label: string;
    column: ColumnType;
    data: Data;
    updatedAt?: string;
}

export default IBoardItem;
