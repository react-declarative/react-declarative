import { ITimeFieldProps, ITimeFieldPrivate } from "../../fields/TimeField";

type TTimeBase = ITimeFieldProps & ITimeFieldPrivate;

export interface ITimeSlot extends TTimeBase { }

export default ITimeSlot;
