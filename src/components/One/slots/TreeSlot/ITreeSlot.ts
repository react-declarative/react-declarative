import { ITreeFieldProps, ITreeFieldPrivate } from "../../fields/TreeField";

type ITreeBase = ITreeFieldProps & ITreeFieldPrivate;

/**
 * Represents a slot in a tree structure.
 * Extends the interface ITreeBase.
 *
 * @interface
 * @extends ITreeBase
 */
export interface ITreeSlot extends ITreeBase { }

export default ITreeSlot;
