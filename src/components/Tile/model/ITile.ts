import IAnything from "../../../model/IAnything";

/**
 * Represents a tile.
 * @template Data - The type of the data stored in the tile.
 * @template Payload - The type of the payload stored in the tile.
 */
export interface ITile<Data = IAnything, Payload = IAnything> {
    data: Data;
    payload: Payload;
    isSelected: boolean;
    rowMark: string;
    toggleSelection: () => void;
}

export default ITile;
