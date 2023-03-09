import IAnything from "../../../../model/IAnything";
import { IListActionOption } from "../../../../model/IListProps";

export interface IActionMenuSlot {
    options?: Partial<IListActionOption>[];
    deps?: IAnything[];
}

export default IActionMenuSlot;
