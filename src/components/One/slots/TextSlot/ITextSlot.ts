import { ITextFieldProps, ITextFieldPrivate } from "../../../../fields/TextField";

type ITextBase = ITextFieldProps & ITextFieldPrivate;

export interface ITextSlot extends ITextBase { }

export default ITextSlot;
