import { IChooseFieldProps, IChooseFieldPrivate } from "../../fields/ChooseField";

type IChooseBase = IChooseFieldProps & IChooseFieldPrivate;

export interface IChooseSlot extends IChooseBase { }

export default IChooseSlot;
