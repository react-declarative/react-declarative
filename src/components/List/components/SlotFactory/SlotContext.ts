import { createContext } from 'react';

import BodyRow from './components/BodyRow/BodyRow'
import CheckboxCell from './components/CheckboxCell/CheckboxCell'
import CommonCell from './components/CommonCell/CommonCell'
import ExpansionRow from './components/ExpansionRow/ExpansionRow'
import HeadRow from './components/HeadRow/HeadRow'

import ISlotFactoryContext from './ISlotFactoryContext';

export const defaultSlots = {
    BodyRow,
    CheckboxCell,
    CommonCell,
    ExpansionRow,
    HeadRow,
};

export const SlotContext = createContext<ISlotFactoryContext>(defaultSlots);

export default SlotContext;
