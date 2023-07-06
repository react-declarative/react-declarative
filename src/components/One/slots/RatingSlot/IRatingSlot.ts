import { IRatingFieldProps, IRatingFieldPrivate } from "../../fields/RatingField";

export interface IRatingSlot extends Omit<IRatingFieldProps, "readonly">, IRatingFieldPrivate { }

export default IRatingSlot;
