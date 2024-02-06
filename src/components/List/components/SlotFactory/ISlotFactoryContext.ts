import { ComponentType } from 'react';

import { IBodyRowSlot } from '../../slots/BodyRowSlot';
import { ICheckboxCellSlot } from '../../slots/CheckboxCellSlot';
import { ICommonCellSlot } from '../../slots/CommonCellSlot';
import { IHeadRowSlot } from '../../slots/HeadRowSlot';
import { IActionAddSlot } from '../../slots/ActionAddSlot';
import { IActionMenuSlot } from '../../slots/ActionMenuSlot';
import { IActionFabSlot } from '../../slots/ActionFabSlot';

import { IActionListSlot } from '../../slots/ActionListSlot';
import { IChipListSlot } from '../../slots/ChipListSlot';
import { IFilterListSlot } from '../../slots/FilterListSlot';
import { IOperationListSlot } from '../../slots/OperationListSlot';
import { ISearchSlot } from '../../slots/SearchSlot';

export interface ISlotFactoryContext {
    DesktopBodyRow: ComponentType<IBodyRowSlot>;
    MobileBodyRow: ComponentType<IBodyRowSlot>;
    BodyRow: ComponentType<IBodyRowSlot>;
    CheckboxCell: ComponentType<ICheckboxCellSlot>;
    CommonCell: ComponentType<ICommonCellSlot>;
    HeadRow: ComponentType<IHeadRowSlot>;
    ActionAdd: ComponentType<IActionAddSlot>;
    ActionFab: ComponentType<IActionFabSlot>;
    ActionMenu: ComponentType<IActionMenuSlot>;
    ActionListSlot: ComponentType<IActionListSlot>;
    FilterListSlot: ComponentType<IFilterListSlot>;
    ChipListSlot: ComponentType<IChipListSlot>;
    OperationListSlot: ComponentType<IOperationListSlot>;
    SearchSlot: ComponentType<ISearchSlot>;
}

export default ISlotFactoryContext;
