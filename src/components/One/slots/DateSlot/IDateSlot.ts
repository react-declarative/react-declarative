import { IDateFieldProps, IDateFieldPrivate } from "../../fields/DateField";

type IDateBase = IDateFieldProps & IDateFieldPrivate;

/**
 * Represents a date slot.
 *
 * @interface IDateSlot
 * @extends IDateBase
 */
export interface IDateSlot extends IDateBase { }

export default IDateSlot;
