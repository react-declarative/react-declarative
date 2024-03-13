import { IComboFieldPrivate, IComboFieldProps } from "../../fields/ComboField";

/**
 * Represents a combo slot for a combo field.
 *
 * @interface IComboSlot
 * @extends Omit<IComboFieldProps, "readonly">
 * @extends IComboFieldPrivate
 */
export interface IComboSlot extends Omit<IComboFieldProps, "readonly">, IComboFieldPrivate { }

export default IComboSlot;
