import { ICompleteFieldProps, ICompleteFieldPrivate } from "../../fields/CompleteField";

type ICompleteBase = ICompleteFieldProps & ICompleteFieldPrivate;

/**
 * Represents a complete slot.
 *
 * @interface ICompleteSlot
 * @extends ICompleteBase
 */
export interface ICompleteSlot extends ICompleteBase { }

export default ICompleteSlot;
