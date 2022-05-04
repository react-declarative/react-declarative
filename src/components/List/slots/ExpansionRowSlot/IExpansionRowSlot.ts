import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

import { IExpansionRowProps } from "../../components/SlotFactory/components/ExpansionRow";

export interface IExpansionRowSlot<RowData extends IRowData = IAnything> extends IExpansionRowProps<RowData> { }

export default IExpansionRowSlot;
