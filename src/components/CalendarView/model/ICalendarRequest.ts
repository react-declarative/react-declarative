import IAnything from "../../../model/IAnything";

/**
 * Represents a calendar request.
 * @template Payload - The type of payload for the calendar request.
 */
export interface ICalendarRequest<Payload extends IAnything = IAnything> {
    payload: Payload;
    fromStamp: number;
    toStamp: number;
}

export default ICalendarRequest;
