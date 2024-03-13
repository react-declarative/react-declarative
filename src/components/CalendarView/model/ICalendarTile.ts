import IAnything from "../../../model/IAnything";

import { ITile } from "../../Tile";

/**
 * Represents a calendar tile.
 *
 * @template Data - The type of data associated with the tile.
 * @template Payload - The type of additional payload associated with the tile.
 */
export interface ICalendarTile<Data = IAnything, Payload = IAnything> extends Omit<ITile<Data, Payload>, keyof {
    toggleSelection: never;
    isSelected: never;
}> {
    onDaySelect: () => void;
}

export default ICalendarTile;
