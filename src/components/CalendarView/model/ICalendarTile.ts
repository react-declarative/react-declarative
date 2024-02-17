import IAnything from "../../../model/IAnything";

import { ITile } from "../../Tile";

export interface ICalendarTile<Data = IAnything, Payload = IAnything> extends Omit<ITile<Data, Payload>, keyof {
    toggleSelection: never;
    isSelected: never;
}> {
    onDaySelect: () => void;
}

export default ICalendarTile;
