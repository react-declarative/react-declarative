import IAnything from "../../../model/IAnything";

export interface ICalendarRequest<Payload extends IAnything = IAnything> {
    payload: Payload;
    fromStamp: number;
    toStamp: number;
}

export default ICalendarRequest;
