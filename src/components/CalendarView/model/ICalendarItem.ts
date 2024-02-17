import IAnything from "../../../model/IAnything";
import { stamp } from "../../../utils/getMomentStamp";

export interface ICalendarItem<Data = IAnything, Payload = IAnything> {
    data: Data;
    payload: Payload;
    stamp: stamp;
}

export default ICalendarItem;
