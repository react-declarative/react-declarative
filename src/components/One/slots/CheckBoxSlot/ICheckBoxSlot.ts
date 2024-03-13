import { ICheckboxFieldPrivate, ICheckboxFieldProps } from "../../fields/CheckboxField";

/**
 * Represents a checkbox slot for a checkbox field.
 *
 * @interface ICheckBoxSlot
 * @extends ICheckboxFieldProps
 * @extends ICheckboxFieldPrivate
 */
export interface ICheckBoxSlot extends ICheckboxFieldProps, ICheckboxFieldPrivate { }

export default ICheckBoxSlot;
