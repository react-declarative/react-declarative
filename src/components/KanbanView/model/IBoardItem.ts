import IAnything from "../../../model/IAnything";

export interface IBoardItem<Data = IAnything> {
    id: string;
    label: string;
    column: string;
    data: Data;
    updatedAt?: string;
}

export default IBoardItem;
