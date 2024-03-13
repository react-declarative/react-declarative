import IAnything from "../../../model/IAnything";
import { stamp } from "../../../utils/getMomentStamp";

/**
 * Represents a calendar item.
 *
 * @export
 * @interface ICalendarItem
 * @template Data The type of data associated with the calendar item.
 * @template Payload The type of payload associated with the calendar item.
 */
export interface ICalendarItem<Data = IAnything, Payload = IAnything> {
    data: Data;
    payload: Payload;
    stamp: stamp;
}

export default ICalendarItem;
