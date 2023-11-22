import { IYesNoFieldPrivate, IYesNoFieldProps } from "../../fields/YesNoField";

export interface IYesNoSlot extends Omit<IYesNoFieldProps, "readonly">, IYesNoFieldPrivate { }

export default IYesNoSlot;
