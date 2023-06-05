import { IFileFieldProps, IFileFieldPrivate } from "../../fields/FileField";

type IFileBase = IFileFieldProps & IFileFieldPrivate;

export interface IFileSlot extends IFileBase { }

export default IFileSlot;
