import { ComponentType } from 'react';

import { IBodyRowSlot } from '../../slots/BodyRowSlot';
import { ICheckboxCellSlot } from '../../slots/CheckboxCellSlot';
import { ICommonCellSlot } from '../../slots/CommonCellSlot';
import { IHeadRowSlot } from '../../slots/HeadRowSlot';

export interface ISlotFactoryContext {
    BodyRow: ComponentType<IBodyRowSlot>;
    CheckboxCell: ComponentType<ICheckboxCellSlot>;
    CommonCell: ComponentType<ICommonCellSlot>;
    HeadRow: ComponentType<IHeadRowSlot>;
}

export default ISlotFactoryContext;
