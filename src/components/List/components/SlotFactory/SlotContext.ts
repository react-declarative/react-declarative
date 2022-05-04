import { createContext } from 'react';

import BodyRow from './components/BodyRow'
import CheckboxCell from './components/CheckboxCell'
import CommonCell from './components/CommonCell'
import ExpansionRow from './components/ExpansionRow'
import HeadRow from './components/HeadRow'

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
