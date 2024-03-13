import { IItemsFieldPrivate, IItemsFieldProps } from "../../fields/ItemsField";

/**
 * Represents an interface for an ItemsSlot in a field.
 * Extends the IItemsFieldProps and IItemsFieldPrivate interfaces.
 *
 * @interface IItemsSlot
 * @extends {IItemsFieldProps}
 * @extends {IItemsFieldPrivate}
 */
export interface IItemsSlot extends IItemsFieldProps, IItemsFieldPrivate { }

export default IItemsSlot;
