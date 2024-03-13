import { ITimeFieldProps, ITimeFieldPrivate } from "../../fields/TimeField";

type TTimeBase = ITimeFieldProps & ITimeFieldPrivate;

/**
 * Represents a time slot.
 * @interface ITimeSlot
 * @extends TTimeBase
 */
export interface ITimeSlot extends TTimeBase { }

export default ITimeSlot;
