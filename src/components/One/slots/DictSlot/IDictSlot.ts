import { IDictFieldProps, IDictFieldPrivate } from "../../fields/DictField";

type IDictBase = IDictFieldProps & IDictFieldPrivate;

export interface IDictSlot extends IDictBase { }

export default IDictSlot;
