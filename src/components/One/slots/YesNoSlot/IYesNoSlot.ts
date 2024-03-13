import { IYesNoFieldPrivate, IYesNoFieldProps } from "../../fields/YesNoField";

/**
 * Represents a Yes/No slot.
 *
 * @interface IYesNoSlot
 * @extends IYesNoFieldProps
 * @extends IYesNoFieldPrivate
 */
export interface IYesNoSlot extends Omit<IYesNoFieldProps, "readonly">, IYesNoFieldPrivate { }

export default IYesNoSlot;
