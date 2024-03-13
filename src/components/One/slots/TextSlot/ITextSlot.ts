import { ITextFieldProps, ITextFieldPrivate } from "../../fields/TextField";

type ITextBase = ITextFieldProps & ITextFieldPrivate;

/**
 * Represents a text slot.
 * @interface
 * @extends {ITextBase}
 */
export interface ITextSlot extends ITextBase { }

export default ITextSlot;
