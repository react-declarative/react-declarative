import createStateProvider from "../../../utils/createStateProvider";

import ICalendarItem from "../model/ICalendarItem";
import ICalendarRequest from "../model/ICalendarRequest";

/**
 * Interface representing a request for calendar items.
 * Extends the interface ICalendarRequest.
 */
interface IRequest extends ICalendarRequest {
    promise: Promise<ICalendarItem[]>;
}

export const [RequestProvider, useRequestContext] = createStateProvider<IRequest | null>();

export default useRequestContext;
