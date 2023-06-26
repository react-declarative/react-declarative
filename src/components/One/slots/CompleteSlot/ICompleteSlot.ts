import { ICompleteFieldProps, ICompleteFieldPrivate } from "../../fields/CompleteField";

type ICompleteBase = ICompleteFieldProps & ICompleteFieldPrivate;

export interface ICompleteSlot extends ICompleteBase { }

export default ICompleteSlot;
