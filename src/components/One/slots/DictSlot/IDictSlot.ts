import { IDictFieldProps, IDictFieldPrivate } from "../../fields/DictField";

type IDictBase = IDictFieldProps & IDictFieldPrivate;

/**
 * Represents an interface for a dictionary slot.
 * @interface
 * @extends IDictBase
 */
export interface IDictSlot extends IDictBase { }

export default IDictSlot;
