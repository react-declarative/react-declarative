import { IActionMenuProps } from "../../../common/ActionMenu";

import IAnything from "../../../../model/IAnything";
import IRowData from "../../../../model/IRowData";
import IColumn from "../../../../model/IColumn";

import DisplayMode from "../../../../model/DisplayMode";

export type CommonCellColumn<RowData extends IRowData = IAnything> = Omit<IColumn<RowData>, keyof {
    width: never;
}> & {
    width: string;
}

export interface ICommonCellSlot<RowData extends IRowData = IAnything> {
    column: CommonCellColumn<RowData>;
    row: RowData;
    idx: number;
    fullWidth: number;
    mode: DisplayMode;
    onMenuToggle: IActionMenuProps['onToggle'];
    onAction: IActionMenuProps['onAction']
}

export default ICommonCellSlot;
