import { ITreeFieldProps, ITreeFieldPrivate } from "../../fields/TreeField";

type ITreeBase = ITreeFieldProps & ITreeFieldPrivate;

export interface ITreeSlot extends ITreeBase { }

export default ITreeSlot;
