import { IDateFieldProps, IDateFieldPrivate } from "../../fields/DateField";

type IDateBase = IDateFieldProps & IDateFieldPrivate;

export interface IDateSlot extends IDateBase { }

export default IDateSlot;
