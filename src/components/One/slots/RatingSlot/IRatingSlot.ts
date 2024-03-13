import { IRatingFieldProps, IRatingFieldPrivate } from "../../fields/RatingField";

/**
 * Represents a rating slot.
 *
 * @interface
 * @extends IRatingFieldProps
 * @extends IRatingFieldPrivate
 */
export interface IRatingSlot extends Omit<IRatingFieldProps, "readonly">, IRatingFieldPrivate { }

export default IRatingSlot;
