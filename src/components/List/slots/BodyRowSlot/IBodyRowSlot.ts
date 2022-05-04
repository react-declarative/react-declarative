import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

import { IBodyRowProps } from "../../components/SlotFactory/components/BodyRow";

export interface IBodyRowSlot<RowData extends IRowData = IAnything> extends IBodyRowProps<RowData> { }

export default IBodyRowSlot;
