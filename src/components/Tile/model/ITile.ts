import IAnything from "../../../model/IAnything";

export interface ITile<Data = IAnything, Payload = IAnything> {
    data: Data;
    payload: Payload;
    isSelected: boolean;
    rowColor: string;
    toggleSelection: () => void;
}

export default ITile;
