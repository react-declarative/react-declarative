import { ComponentType } from 'react';

import { IBodyRowSlot } from '../../slots/BodyRowSlot';
import { ICheckboxCellSlot } from '../../slots/CheckboxCellSlot';
import { ICommonCellSlot } from '../../slots/CommonCellSlot';
import { IHeadRowSlot } from '../../slots/HeadRowSlot';
import { IActionAddSlot } from '../../slots/ActionAddSlot';
import { IActionMenuSlot } from '../../slots/ActionMenuSlot';
import { IActionFabSlot } from '../../slots/ActionFabSlot';

export interface ISlotFactoryContext {
    BodyRow: ComponentType<IBodyRowSlot>;
    CheckboxCell: ComponentType<ICheckboxCellSlot>;
    CommonCell: ComponentType<ICommonCellSlot>;
    HeadRow: ComponentType<IHeadRowSlot>;
    ActionAdd: ComponentType<IActionAddSlot>;
    ActionFab: ComponentType<IActionFabSlot>;
    ActionMenu: ComponentType<IActionMenuSlot>;
}

export default ISlotFactoryContext;
