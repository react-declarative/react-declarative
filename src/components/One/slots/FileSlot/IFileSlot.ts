import { IFileFieldProps, IFileFieldPrivate } from "../../fields/FileField";

type IFileBase = IFileFieldProps & IFileFieldPrivate;

/**
 * Represents a file slot interface that extends the IFileBase interface.
 *
 * @interface
 * @extends {IFileBase}
 */
export interface IFileSlot extends IFileBase { }

export default IFileSlot;
