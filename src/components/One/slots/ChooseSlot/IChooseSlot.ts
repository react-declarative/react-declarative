import { IChooseFieldProps, IChooseFieldPrivate } from "../../fields/ChooseField";

type IChooseBase = IChooseFieldProps & IChooseFieldPrivate;

/**
 * Represents the interface for choosing a time slot.
 * @interface
 * @extends IChooseBase
 */
export interface IChooseSlot extends IChooseBase { }

export default IChooseSlot;
