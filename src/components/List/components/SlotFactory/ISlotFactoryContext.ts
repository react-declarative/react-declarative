import { ComponentType } from 'react';

import { IBodyRowSlot } from '../../slots/BodyRowSlot';
import { ICheckboxCellSlot } from '../../slots/CheckboxCellSlot';
import { ICommonCellSlot } from '../../slots/CommonCellSlot';
import { IHeadRowSlot } from '../../slots/HeadRowSlot';
import { IActionAddSlot } from '../../slots/ActionAddSlot';
import { IActionMenuSlot } from '../../slots/ActionMenuSlot';

export interface ISlotFactoryContext {
    BodyRow: ComponentType<IBodyRowSlot>;
    CheckboxCell: ComponentType<ICheckboxCellSlot>;
    CommonCell: ComponentType<ICommonCellSlot>;
    HeadRow: ComponentType<IHeadRowSlot>;
    ActionAdd: ComponentType<IActionAddSlot>;
    ActionMenu: ComponentType<IActionMenuSlot>;
}

export default ISlotFactoryContext;
