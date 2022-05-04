import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";

import { ICommonCellProps } from "../../components/SlotFactory/components/CommonCell";

export interface ICommonCellSlot<RowData extends IRowData = IAnything> extends ICommonCellProps<RowData> { }

export default ICommonCellSlot;
