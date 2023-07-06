import { IComboFieldPrivate, IComboFieldProps } from "../../fields/ComboField";

export interface IComboSlot extends Omit<IComboFieldProps, "readonly">, IComboFieldPrivate { }

export default IComboSlot;
